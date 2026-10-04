"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "cookie-consent";
const GA_MEASUREMENT_ID = "G-JEB97917KZ";

export default function AnalyticsScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    function checkConsent() {
      try {
        setConsented(window.localStorage.getItem(STORAGE_KEY) === "accepted");
      } catch {
        setConsented(false);
      }
    }
    checkConsent();
    window.addEventListener("cookie-consent-changed", checkConsent);
    return () => window.removeEventListener("cookie-consent-changed", checkConsent);
  }, []);

  if (!consented) return null;

  return (
    <>
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
    </>
  );
}