import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
	const clientId = process.env.PAYPAL_CLIENT_ID!;
	const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

	const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	const data = await response.json();
	return data.access_token;
}

// NOTE: every console.log/console.error in this file prints to the
// terminal running `npm run dev` (the Node.js server process) - NOT to
// the browser DevTools console. Look here, not in the browser, for these.
export async function POST(request: NextRequest) {
	console.log("[paypal-capture] request received");

	try {
		const { orderID } = await request.json();
		console.log("[paypal-capture] orderID from request body:", orderID);

		if (!orderID) {
			console.error("[paypal-capture] rejecting - no orderID in request body");
			return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
		}

		console.log("[paypal-capture] requesting PayPal access token...");
		const accessToken = await getAccessToken();
		if (!accessToken) {
			console.error("[paypal-capture] failed to get a PayPal access token - check PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET");
			return NextResponse.json({ error: "Could not authenticate with PayPal" }, { status: 500 });
		}
		console.log("[paypal-capture] got PayPal access token, calling capture endpoint...");

		const captureResponse = await fetch(
			`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const captureData = await captureResponse.json();
		console.log("[paypal-capture] PayPal capture response - http status:", captureResponse.status, "order status:", captureData?.status);

		if (!captureResponse.ok) {
			console.error("[paypal-capture] PayPal capture call FAILED:", JSON.stringify(captureData));
			return NextResponse.json(
				{ error: captureData?.message || "Capture failed" },
				{ status: captureResponse.status }
			);
		}

		// Update Supabase directly here instead of relying solely on the
		// PayPal webhook: the webhook needs a URL configured in the PayPal
		// dashboard that PayPal's servers can reach, which a local dev
		// server (localhost) never satisfies, and even in production a
		// misconfigured/undelivered webhook would silently leave the user
		// unsubscribed despite a completed payment. This capture call is
		// the one step we know always runs, so it's the reliable place to
		// write the subscription state.
		const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
		const email = capture?.custom_id || captureData.payer?.email_address;
		console.log(
			"[paypal-capture] resolved email for profiles upsert:",
			email,
			"(from custom_id:", capture?.custom_id, ", payer email:", captureData.payer?.email_address, ")"
		);

		if (captureData.status === "COMPLETED" && email) {
			console.log("[paypal-capture] upserting profiles row for", email);
			const supabaseAdmin = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
			);

			const { data: upsertData, error: upsertError } = await supabaseAdmin
				.from("profiles")
				.upsert({ email, is_subscribed: true }, { onConflict: "email" })
				.select();

			if (upsertError) {
				console.error("[paypal-capture] Supabase profiles upsert FAILED:", JSON.stringify(upsertError));
			} else {
				console.log("[paypal-capture] Supabase profiles upsert OK:", JSON.stringify(upsertData));
			}
		} else {
			console.error(
				"[paypal-capture] NOT upserting - order status:", captureData.status, ", email:", email,
				"(need status COMPLETED and a non-empty email)"
			);
		}

		console.log("[paypal-capture] done, returning success to client");
		return NextResponse.json({
			status: captureData.status,
			id: captureData.id,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("[paypal-capture] unexpected exception:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
