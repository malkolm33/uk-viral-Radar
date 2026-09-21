import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const email = body.resource?.payer?.email_address;

      if (email) {
        // Service role key: this is a server-to-server call from PayPal's
        // servers with no logged-in user session, so the anon key would be
        // rejected by the "profiles" table's Row Level Security policies.
        const supabaseAdmin = createAdminClient();

        await supabaseAdmin
          .from("profiles")
          .upsert({ email, is_subscribed: true }, { onConflict: "email" });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}