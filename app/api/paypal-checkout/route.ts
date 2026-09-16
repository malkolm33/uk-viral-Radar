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

export async function POST(request: NextRequest) {
	try {
		const accessToken = await getAccessToken();

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
						amount: {
							currency_code: "GBP",
							value: "9.99",
						},
						description: "UK Viral Radar Pro - Monthly Access",
					},
				],
				application_context: {
					return_url: `${request.nextUrl.origin}/?payment=success`,
					cancel_url: `${request.nextUrl.origin}/?payment=cancelled`,
				},
			}),
		});

		const orderData = await orderResponse.json();
		const approveLink = orderData.links?.find((link: any) => link.rel === "approve");
        const orderId = orderData.id;
		return NextResponse.json({ url: approveLink?.href });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("PayPal checkout error:", errorMessage);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
