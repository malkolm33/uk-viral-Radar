import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../lib/stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    console.error("Stripe checkout error: STRIPE_SECRET_KEY or STRIPE_PRICE_ID is not set");
    return NextResponse.json({ error: "Card payments are temporarily unavailable. Please pay with PayPal or try again shortly." }, { status: 503 });
  }
  try {
    const { email } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${request.nextUrl.origin}/dashboard?payment=success`,
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
