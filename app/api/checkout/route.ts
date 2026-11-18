import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../lib/stripe";
import { createClient } from "../../lib/supabase-server";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    console.error("Stripe checkout error: STRIPE_SECRET_KEY or STRIPE_PRICE_ID is not set");
    return NextResponse.json({ error: "Card payments are temporarily unavailable. Please pay with PayPal or try again shortly." }, { status: 503 });
  }

  // The email comes from the verified login session, never from the request
  // body: otherwise someone logged in as A could pay as B and never get Pro.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Please log in to upgrade." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  // Consumer Contracts Regulations: the customer must ask for immediate access
  // and acknowledge losing the 14-day cancellation right before we take payment.
  if (body?.consent !== true) {
    return NextResponse.json({ error: "Please tick the box to confirm before paying." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { user_id: user.id, immediate_access_consent: "yes", consent_at: new Date().toISOString() },
      subscription_data: { metadata: { user_id: user.id } },
      custom_text: {
        submit: {
          message:
            "£9.99/month, renews automatically until you cancel. Cancel any time from your dashboard (Manage subscription). Access starts immediately, so the 14-day cancellation right ends once you start using Pro.",
        },
      },
      success_url: `${request.nextUrl.origin}/dashboard?payment=success&provider=stripe`,
      cancel_url: `${request.nextUrl.origin}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Full detail stays in the server log (emails masked); the customer gets a generic message.
    const detail = (error instanceof Error ? error.message : String(error)).replace(/[^\s@]+@[^\s@]+/g, "[email]");
    console.error("Stripe checkout error:", detail);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
