import Link from "next/link";
import type { Metadata } from "next";
import ProfitCalculatorForm from "./ProfitCalculatorForm";

export const metadata: Metadata = {
  title: "Free Profit Margin Calculator for UK Dropshippers",
  description:
    "Calculate your profit margin before listing a product. Free tool for UK dropshippers and e-commerce sellers.",
  openGraph: {
    title: "Free Profit Margin Calculator for UK Dropshippers",
    description:
      "Calculate your profit margin before listing a product. Free tool for UK dropshippers and e-commerce sellers.",
    type: "website",
  },
};

export default function ProfitCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A]">
            Back to home
          </Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          Profit Margin Calculator
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#64748B] sm:text-base">
          Calculate your profit margin before listing a product. Free tool for UK dropshippers and
          e-commerce sellers.
        </p>

        <div className="mt-8">
          <ProfitCalculatorForm />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/5 p-8 text-center sm:p-10">
          <h2 className="text-lg font-semibold text-[#0F172A] sm:text-xl">
            Want to find winning products, not just price them?
          </h2>
          <Link
            href="/login"
            className="rounded-full bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white"
          >
            Try UK Viral Radar Free
          </Link>
        </div>
      </div>
    </main>
  );
}
