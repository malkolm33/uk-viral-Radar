import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../lib/stripe";
import { createClient } from "../../lib/supabase-server";

// Opens Stripe's hosted Customer Portal so a card subscriber can cancel or
// update their card without emailing us. Needs the portal switched on in the
// Stripe dashboard (Settings > Billing > Customer portal).
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Subscription management is temporarily unavailable. Email info@ukviralradar.com to cancel." }, { status: 503 });
  }

  try {
    const found = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = found.data[0];
    if (!customer) {
      return NextResponse.json(
        { error: "No card subscription found for this account. PayPal Pro ends by itself at the end of the paid period - nothing to cancel." },
        { status: 404 }
      );
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${request.nextUrl.origin}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    const detail = (error instanceof Error ? error.message : String(error)).replace(/[^\s@]+@[^\s@]+/g, "[email]");
    console.error("Billing portal error:", detail);
    return NextResponse.json({ error: "Could not open subscription settings. Email info@ukviralradar.com and we will cancel for you." }, { status: 500 });
  }
}
