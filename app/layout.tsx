import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Viral Radar - Spot Trending Products Before Your Competitors",
  description:
    "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.",
  openGraph: {
    title: "UK Viral Radar - Spot Trending Products Before Your Competitors",
    description:
      "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}