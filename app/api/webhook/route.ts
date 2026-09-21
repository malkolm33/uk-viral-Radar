import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "../../lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
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
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error) {
		console.error("Webhook signature verification failed:", error);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const email = session.customer_email;

		if (email) {
			await supabaseAdmin
				.from("profiles")
				.upsert({ email, is_subscribed: true }, { onConflict: "email" });
		}
	}

	return NextResponse.json({ received: true });
}
