import Stripe from "stripe";

// Create the Stripe client only when a request actually needs it, not when the
// module is loaded. Next.js loads route modules during "next build" to collect
// page data; creating the client at load time made every build without
// STRIPE_SECRET_KEY (e.g. Vercel Preview deployments of robot blog posts) fail.
let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}
