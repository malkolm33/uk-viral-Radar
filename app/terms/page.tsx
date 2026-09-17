import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
        </Link>

        <div className="rounded-lg border border-[#E4E7EC] bg-white p-8 sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-[#64748B]">Last updated: 17 September 2026</p>

          <div className="mt-4 rounded-md border border-[#E4E7EC] bg-[#F7F8FA] p-4 text-xs leading-relaxed text-[#64748B]">
            This is a draft set of terms provided as a general starting point and has not been reviewed by
            a lawyer. Please have it reviewed by a qualified professional before relying on it for your
            business.
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#0F172A]">
            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">1. Acceptance of Terms</h2>
              <p className="mt-2 text-[#64748B]">
                By creating an account or using UK Viral Radar (the &quot;Service&quot;), you agree to be
                bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
                please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">2. Description of Service</h2>
              <p className="mt-2 text-[#64748B]">
                UK Viral Radar is a product-trend discovery tool aimed at UK-based dropshippers and
                e-commerce sellers. We combine data from sources such as Google Trends, Wikipedia, eBay,
                Etsy and YouTube into a single Viral Score to help you identify products that may be
                gaining popularity. The Service is provided for informational purposes only and does not
                guarantee any particular business outcome.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">3. Subscription &amp; Billing</h2>
              <p className="mt-2 text-[#64748B]">
                A limited, free version of the Service is available without a subscription. Full access to
                the Service (&quot;Pro&quot;) is available for £9.99 per month, billed on a recurring
                monthly basis via Stripe or PayPal starting on the date you subscribe. By subscribing, you
                authorise us to charge your chosen payment method automatically each billing period until
                you cancel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">4. Cancellation Policy</h2>
              <p className="mt-2 text-[#64748B]">
                You may cancel your Pro subscription at any time. Cancellation will take effect at the end
                of your current billing period, and you will retain Pro access until that date. We do not
                provide partial refunds for unused time within a billing period unless required by
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">5. User Responsibilities</h2>
              <p className="mt-2 text-[#64748B]">By using the Service, you agree that you will:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#64748B]">
                <li>Provide accurate information when creating your account;</li>
                <li>Keep your login credentials confidential and secure;</li>
                <li>Use the Service only for lawful purposes and in accordance with these Terms;</li>
                <li>
                  Not attempt to disrupt, reverse-engineer, scrape at scale, or gain unauthorised access to
                  the Service or its underlying data and systems;
                </li>
                <li>Be responsible for any decisions you make in your own business based on the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">6. &quot;As Is&quot; Service</h2>
              <p className="mt-2 text-[#64748B]">
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without
                warranties of any kind, whether express or implied. We do not guarantee that the Service
                will be uninterrupted, error-free, or that the underlying trend data (sourced from Google
                Trends, Wikipedia, eBay, Etsy, YouTube and other third parties) will always be accurate,
                complete or up to date. To the maximum extent permitted by law, we are not liable for any
                loss or damage arising from your use of, or reliance on, the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">7. Changes to Pricing</h2>
              <p className="mt-2 text-[#64748B]">
                We reserve the right to change our subscription pricing at any time. If we change the price
                of your active subscription, we will provide reasonable advance notice before the new price
                takes effect, and any change will apply from your next billing cycle onward.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">8. Changes to These Terms</h2>
              <p className="mt-2 text-[#64748B]">
                We may update these Terms from time to time. If we make material changes, we will update
                the &quot;Last updated&quot; date above and, where appropriate, notify you directly.
                Continued use of the Service after changes take effect constitutes acceptance of the
                updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">9. Termination</h2>
              <p className="mt-2 text-[#64748B]">
                We may suspend or terminate your access to the Service if you violate these Terms. You may
                stop using the Service and close your account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">10. Governing Law</h2>
              <p className="mt-2 text-[#64748B]">
                These Terms are governed by the laws of England and Wales, without regard to conflict of
                law principles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">11. Contact Us</h2>
              <p className="mt-2 text-[#64748B]">
                Questions about these Terms? Get in touch via our{" "}
                <Link href="/contact" className="font-medium text-[#16A34A] underline">
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0F172A]">Back to home</Link>
        </p>
      </div>
    </main>
  );
}
