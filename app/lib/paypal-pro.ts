import type { SupabaseClient } from "@supabase/supabase-js";

// PayPal payments here are one-off £9.99 orders (not a PayPal subscription),
// so each completed payment buys PRO_DAYS of Pro: profiles.pro_until is
// pushed forward and the dashboard stops treating the account as Pro once
// that date has passed. Stripe subscriptions leave pro_until NULL and are
// switched off by the Stripe webhook instead.
//
// The same payment can arrive twice (the capture call AND PayPal's webhook),
// so the capture id is remembered and a repeat is ignored - otherwise one
// payment would add 62 days.
export const PRO_DAYS = 31;
export const PRICE = { currency: "GBP", value: "9.99" };

export async function grantPaypalMonth(
  supabaseAdmin: SupabaseClient,
  email: string,
  captureId: string
): Promise<{ ok: boolean; skipped?: boolean; until?: string; error?: string }> {
  const { data: rows, error } = await supabaseAdmin
    .from("profiles")
    .select("pro_until, paypal_capture_id")
    .eq("email", email)
    .limit(1);
  if (error) return { ok: false, error: error.message };
  const row = rows?.[0];
  if (row?.paypal_capture_id === captureId) return { ok: true, skipped: true, until: row.pro_until };

  const now = Date.now();
  const current = row?.pro_until ? new Date(row.pro_until).getTime() : 0;
  const start = current > now ? current : now; // paying early extends, never shortens
  const until = new Date(start + PRO_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error: upsertError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      { email, is_subscribed: true, pro_until: until, paypal_capture_id: captureId },
      { onConflict: "email" }
    );
  if (upsertError) return { ok: false, error: upsertError.message };
  return { ok: true, until };
}

// Pro = paid, and (Stripe: no end date) or (PayPal: end date still ahead).
export function isProRow(row: { is_subscribed?: boolean | null; pro_until?: string | null } | null | undefined): boolean {
  if (!row?.is_subscribed) return false;
  if (!row.pro_until) return true;
  return new Date(row.pro_until).getTime() > Date.now();
}
