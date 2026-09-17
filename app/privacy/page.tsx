import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#64748B]">Last updated: 17 September 2026</p>

          <div className="mt-4 rounded-md border border-[#E4E7EC] bg-[#F7F8FA] p-4 text-xs leading-relaxed text-[#64748B]">
            This is a draft policy provided as a general starting point and has not been reviewed by a
            lawyer. Please have it reviewed by a qualified professional before relying on it for your
            business.
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#0F172A]">
            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">1. Introduction</h2>
              <p className="mt-2 text-[#64748B]">
                UK Viral Radar (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides a product-trend
                discovery service for UK e-commerce sellers and dropshippers. This Privacy Policy explains
                what information we collect when you use our website and service (the &quot;Service&quot;),
                how we use it, and the choices you have.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">2. Information We Collect</h2>
              <p className="mt-2 text-[#64748B]">We collect the following types of information:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#64748B]">
                <li>
                  <span className="font-medium text-[#0F172A]">Account information:</span> your email
                  address and password (stored securely, never in plain text) when you create an account.
                </li>
                <li>
                  <span className="font-medium text-[#0F172A]">Usage data:</span> how you interact with the
                  Service - such as pages viewed and features used - to help us understand and improve the
                  product.
                </li>
                <li>
                  <span className="font-medium text-[#0F172A]">Payment information:</span> limited billing
                  details needed to process your subscription (see Section 5 - Payment Processing).
                </li>
                <li>
                  <span className="font-medium text-[#0F172A]">Communications:</span> information you
                  provide when you contact us, for example via our{" "}
                  <Link href="/contact" className="font-medium text-[#16A34A] underline">
                    Contact page
                  </Link>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">3. How We Use Your Information</h2>
              <p className="mt-2 text-[#64748B]">We use the information we collect to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#64748B]">
                <li>Provide, operate and maintain the Service, including your account and subscription;</li>
                <li>Process payments and manage billing;</li>
                <li>Respond to your questions and support requests;</li>
                <li>Monitor and improve the reliability and performance of the Service;</li>
                <li>Communicate important updates, such as changes to these policies or your subscription.</li>
              </ul>
              <p className="mt-3 text-[#64748B]">We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">4. Data Storage</h2>
              <p className="mt-2 text-[#64748B]">
                Your account and application data is stored using Supabase, a third-party database and
                authentication provider. Supabase maintains its own security and privacy practices, and
                data may be processed on infrastructure operated by Supabase and its sub-processors. We
                take reasonable technical and organisational measures to protect your data against
                unauthorised access, loss or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">5. Payment Processing</h2>
              <p className="mt-2 text-[#64748B]">
                Subscription payments are processed by Stripe and PayPal, our third-party payment
                processors. When you subscribe, your card or PayPal account details are provided directly
                to Stripe or PayPal - we do not receive, process or store your full card number, CVV or
                other sensitive payment credentials on our own servers. We only receive limited information
                needed to manage your subscription, such as your subscription status and billing email.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">6. Cookies</h2>
              <p className="mt-2 text-[#64748B]">
                We use cookies and similar technologies to keep you signed in, remember your preferences,
                and understand how the Service is used. You can control or disable cookies through your
                browser settings, though some parts of the Service may not function properly without them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">7. Data Retention &amp; Your Rights</h2>
              <p className="mt-2 text-[#64748B]">
                We retain your personal information for as long as your account is active or as needed to
                provide the Service, comply with our legal obligations, and resolve disputes. You have the
                right to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#64748B]">
                <li>Access the personal information we hold about you;</li>
                <li>Request correction of inaccurate information;</li>
                <li>Request deletion of your account and associated personal data;</li>
                <li>Object to or restrict certain uses of your data.</li>
              </ul>
              <p className="mt-3 text-[#64748B]">
                To exercise any of these rights, including account deletion, please contact us via our{" "}
                <Link href="/contact" className="font-medium text-[#16A34A] underline">
                  Contact page
                </Link>{" "}
                and we will action your request within a reasonable time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">8. Children&apos;s Privacy</h2>
              <p className="mt-2 text-[#64748B]">
                The Service is intended for business use by adults and is not directed at children. We do
                not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">9. Changes to This Policy</h2>
              <p className="mt-2 text-[#64748B]">
                We may update this Privacy Policy from time to time. If we make material changes, we will
                update the &quot;Last updated&quot; date above and, where appropriate, notify you directly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#0F172A]">10. Contact Us</h2>
              <p className="mt-2 text-[#64748B]">
                If you have any questions about this Privacy Policy or how we handle your data, please get
                in touch via our{" "}
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
