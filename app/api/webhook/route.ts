import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "../../lib/supabase-admin";
import { getStripe } from "../../lib/stripe";

// The account is found by the Supabase user id we attach at checkout, so a
// customer who changes their email in Stripe still maps to the right profile.
// The Stripe email is only a fallback (e.g. sessions created before this).
async function accountEmail(
	supabaseAdmin: ReturnType<typeof createAdminClient>,
	userId: string | null | undefined,
	fallback: string | null | undefined
): Promise<string | null> {
	if (userId) {
		const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
		if (!error && data?.user?.email) return data.user.email;
	}
	return fallback ?? null;
}

export async function POST(request: NextRequest) {
	const stripe = getStripe();
	if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
		console.error("Stripe webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set");
		// 500 makes Stripe retry later, so no event is lost while the keys are missing.
		return NextResponse.json({ error: "Not configured" }, { status: 500 });
	}

	// Service role key: this is a server-to-server call from Stripe's
	// servers with no logged-in user session, so the anon key would be
	// rejected by the "profiles" table's Row Level Security policies.
	const supabaseAdmin = createAdminClient();

	const body = await request.text();
	const signature = request.headers.get("stripe-signature")!;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (error) {
		console.error("Webhook signature verification failed:", error);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	// Subscription changed or ended (cancelled, unpaid, deleted in the Stripe
	// dashboard, or paid again after a failed renewal). Needs these events
	// ticked on the webhook endpoint in Stripe: customer.subscription.deleted
	// and customer.subscription.updated.
	if (
		event.type === "customer.subscription.deleted" ||
		event.type === "customer.subscription.updated"
	) {
		const sub = event.data.object as Stripe.Subscription;
		const active = sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
		const ended = event.type === "customer.subscription.deleted" || !active;
		try {
			let stripeEmail: string | null = null;
			if (!sub.metadata?.user_id) {
				const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
				const customer = await stripe.customers.retrieve(customerId);
				stripeEmail = !customer.deleted ? customer.email : null;
			}
			const email = await accountEmail(supabaseAdmin, sub.metadata?.user_id, stripeEmail);
			if (email) {
				// Only rows with no pro_until are Stripe Pro; PayPal Pro (with a
				// pro_until date) is left alone so a card cancellation can't remove it.
				const { error } = ended
					? await supabaseAdmin
							.from("profiles")
							.update({ is_subscribed: false })
							.eq("email", email)
							.is("pro_until", null)
					: await supabaseAdmin
							.from("profiles")
							.update({ is_subscribed: true })
							.eq("email", email)
							.is("pro_until", null);
				if (error) throw new Error(error.message);
			}
		} catch (error) {
			console.error("Could not update Pro after a subscription change:", error);
			return NextResponse.json({ error: "Retry later" }, { status: 500 });
		}
	}

	// async_payment_succeeded: delayed methods (e.g. bank debits) that finish later.
	if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
		const session = event.data.object as Stripe.Checkout.Session;
		const email = await accountEmail(
			supabaseAdmin,
			session.client_reference_id,
			session.customer_email ?? session.customer_details?.email
		);

		// Grant Pro only for a session that was actually paid.
		if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
			console.warn("Checkout completed but not paid yet:", session.id, session.payment_status);
		} else if (!email) {
			console.error("Paid checkout has no email, Pro NOT granted - fix by hand:", session.id);
		} else {
			const { error } = await supabaseAdmin
				.from("profiles")
				.upsert({ email, is_subscribed: true, pro_until: null }, { onConflict: "email" });
			if (error) {
				// 500 makes Stripe retry, so a paying customer is not left without Pro.
				console.error("Could not grant Pro after checkout:", error.message);
				return NextResponse.json({ error: "Retry later" }, { status: 500 });
			}
		}
	}

	return NextResponse.json({ received: true });
}
