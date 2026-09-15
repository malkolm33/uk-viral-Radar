"use client";

export default function PayPalButton() {
	async function handlePayPalCheckout() {
		const res = await fetch("/api/paypal-checkout", {
			method: "POST",
		});
		const data = await res.json();
		if (data.url) window.location.href = data.url;
	}

	return (
		<button
			onClick={handlePayPalCheckout}
			className="rounded-full bg-[#0070BA] px-3 py-1.5 text-xs font-medium text-white"
		>
			Pay with PayPal
		</button>
	);
}
