import { NextRequest, NextResponse } from "next/server";

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
	try {
		const { email } = await request.json().catch(() => ({ email: undefined }));
		console.log("[paypal-checkout] creating order for email:", email);

		const accessToken = await getAccessToken();

		const returnUrl = `${request.nextUrl.origin}/?payment=success`;
		console.log("[paypal-checkout] return_url set to:", returnUrl);

		const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						// Carried through to the capture response so
						// /api/paypal-capture knows which app account to
						// mark as subscribed, even if the buyer's PayPal
						// email differs from their site login email.
						custom_id: email,
						amount: {
							currency_code: "GBP",
							value: "9.99",
						},
						description: "UK Viral Radar Pro - Monthly Access",
					},
				],
				application_context: {
					return_url: returnUrl,
					cancel_url: `${request.nextUrl.origin}/?payment=cancelled`,
				},
			}),
		});

		const orderData = await orderResponse.json();
		const approveLink = orderData.links?.find((link: any) => link.rel === "approve");
		console.log(
			"[paypal-checkout] order created - id:", orderData.id,
			"| status:", orderData.status,
			"| approve link:", approveLink?.href
		);

		if (!orderResponse.ok || !approveLink) {
			console.error("[paypal-checkout] order creation FAILED or no approve link:", JSON.stringify(orderData));
			return NextResponse.json({ error: orderData?.message || "Could not create PayPal order" }, { status: 500 });
		}

		return NextResponse.json({ url: approveLink.href });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("[paypal-checkout] unexpected exception:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
