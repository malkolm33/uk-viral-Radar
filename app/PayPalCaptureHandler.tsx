"use client";

import { useEffect } from "react";

// Runs on the homepage after PayPal redirects back from the approval flow
// (?payment=success&token=<orderID>). PayPal never completes a payment on
// its own here - the order has to be explicitly captured via the API, and
// that capture is what makes PayPal fire the PAYMENT.CAPTURE.COMPLETED
// webhook. This component triggers that capture automatically so the user
// never has to do anything after approving the payment.
//
// Every step below logs to the browser console with a [PayPalCapture]
// prefix so it's obvious from DevTools whether this component ran at all,
// what it saw in the URL, and what the server actually replied - a fetch()
// only rejects on a network failure, not on a 4xx/5xx response, so without
// these logs a failed capture looks identical to a successful one from the
// browser's point of view.
export default function PayPalCaptureHandler() {
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const payment = params.get("payment");
		const orderID = params.get("token");

		console.log("[PayPalCapture] mounted, current URL:", window.location.href);
		console.log("[PayPalCapture] parsed params -> payment:", payment, "| token(orderID):", orderID);

		if (payment !== "success" || !orderID) {
			console.log(
				"[PayPalCapture] skipping - expected ?payment=success&token=<orderID> in the URL but didn't find both. " +
					"If you just approved a PayPal payment and see this, PayPal did not redirect back with the params we expected - check the address bar URL after redirect."
			);
			return;
		}

		console.log("[PayPalCapture] triggering POST /api/paypal-capture for orderID:", orderID);

		fetch("/api/paypal-capture", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ orderID }),
		})
			.then(async (res) => {
				const data = await res.json().catch((parseError) => {
					console.error("[PayPalCapture] response body was not valid JSON:", parseError);
					return null;
				});
				if (!res.ok) {
					console.error("[PayPalCapture] /api/paypal-capture FAILED - status:", res.status, "body:", data);
				} else {
					console.log("[PayPalCapture] /api/paypal-capture OK - status:", res.status, "body:", data);
				}
			})
			.catch((error) => {
				// Only fires on an actual network-level failure (server unreachable,
				// CORS, offline, etc) - NOT on 4xx/5xx responses, those are handled above.
				console.error("[PayPalCapture] network error calling /api/paypal-capture:", error);
			})
			.finally(() => {
				// A page reload wipes the DevTools console (unless "Preserve
				// log" is on), which can make it look like none of the logs
				// above ever ran. Give a few seconds to actually read them
				// before reloading.
				console.log("[PayPalCapture] done - reloading in 4s (read the logs above before they clear)");
				window.history.replaceState({}, "", window.location.pathname);
				setTimeout(() => {
					window.location.reload();
				}, 4000);
			});
	}, []);

	return null;
}
