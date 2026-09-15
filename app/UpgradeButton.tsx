"use client";

export default function UpgradeButton({ email }: { email: string }) {
  async function handleUpgrade() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <button
      onClick={handleUpgrade}
      className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-medium text-white"
    >
      Upgrade - £9.99/mo
    </button>
  );
}