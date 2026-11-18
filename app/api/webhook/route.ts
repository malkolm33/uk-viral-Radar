import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "../../lib/supabase-admin";
import { getStripe } from "../../lib/stripe";

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

	// Subscription ended (cancelled at period end, unpaid, or deleted in the
	// Stripe dashboard): take Pro away again. Without this a cancelled
	// customer kept the full list forever. Needs these events ticked on the
	// webhook endpoint in Stripe: customer.subscription.deleted and
	// customer.subscription.updated.
	if (
		event.type === "customer.subscription.deleted" ||
		event.type === "customer.subscription.updated"
	) {
		const sub = event.data.object as Stripe.Subscription;
		const active = sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
		if (event.type === "customer.subscription.deleted" || !active) {
			try {
				const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
				const customer = await stripe.customers.retrieve(customerId);
				const email = !customer.deleted ? customer.email : null;
				if (email) {
					await supabaseAdmin
						.from("profiles")
						.update({ is_subscribed: false })
						.eq("email", email);
				}
			} catch (error) {
				console.error("Could not end Pro for a cancelled subscription:", error);
				return NextResponse.json({ error: "Retry later" }, { status: 500 });
			}
		}
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const email = session.customer_email;

		if (email) {
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
