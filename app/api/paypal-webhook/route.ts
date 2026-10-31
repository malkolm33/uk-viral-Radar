import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../lib/supabase-admin";
import { grantPaypalMonth, PRICE } from "../../lib/paypal-pro";

const PAYPAL_API = "https://api-m.paypal.com";

async function getAccessToken(): Promise<string | null> {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.access_token ?? null;
}

// SECURITY: nothing in the incoming request body is trusted. Anyone can POST
// to this URL, so the body is only used to learn WHICH capture to look at;
// the capture is then fetched from PayPal's own API with our credentials and
// only a genuine, completed £9.99 GBP capture grants Pro (31 days, once per
// capture - see app/lib/paypal-pro.ts). /api/paypal-capture does the same
// grant right after checkout, so this webhook is only the safety net.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body?.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true });
    }
    const captureId = String(body?.resource?.id ?? "");
    if (!/^[A-Z0-9]{8,40}$/.test(captureId)) {
      return NextResponse.json({ error: "Bad capture id" }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return NextResponse.json({ error: "PayPal auth failed" }, { status: 500 });
    const res = await fetch(`${PAYPAL_API}/v2/payments/captures/${captureId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return NextResponse.json({ received: true }); // unknown capture: ignore
    const capture = await res.json();

    const email = typeof capture?.custom_id === "string" ? capture.custom_id : "";
    const paidRight =
      capture?.status === "COMPLETED" &&
      capture?.amount?.currency_code === PRICE.currency &&
      capture?.amount?.value === PRICE.value;
    if (paidRight && email) {
      const granted = await grantPaypalMonth(createAdminClient(), email, captureId);
      if (!granted.ok) {
        console.error("PayPal webhook: profile update failed:", granted.error);
        return NextResponse.json({ error: "Retry later" }, { status: 500 });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
