import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const { error: dbError } = await supabaseAdmin
    .from("contact_submissions")
    .insert([{ name, email, message }]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;

  if (resendKey && toEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UK Viral Radar <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: email,
          subject: `New contact form message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        }),
      });
    } catch {
      // Email is a best-effort notification - the message is already saved
      // in Supabase either way, so a failed email send shouldn't fail the request.
    }
  }

  return NextResponse.json({ success: true });
}