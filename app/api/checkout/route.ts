import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${request.nextUrl.origin}/dashboard?payment=success`,
      cancel_url: `${request.nextUrl.origin}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
