import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "./CookieConsent";

const GA_MEASUREMENT_ID = "G-JEB97917KZ";

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
  verification: {
    google: "dG0ZjeP9GtTs6kcRRkusXf1dFkofhSzaxGDEvEve-Z0",
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
        <CookieConsent />
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          src="https://code.tidio.co/s9ea9yis0lcohg4taqwnav4clhqd1wyw.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}