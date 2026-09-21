import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key, which bypasses
// Row Level Security entirely. This must NEVER be imported from a
// "use client" component, and SUPABASE_SERVICE_ROLE_KEY must NEVER be
// given a NEXT_PUBLIC_ prefix - either mistake would ship full
// read/write access to the whole database to anyone who opens the
// browser's network tab or view-source.
//
// Only import this from server-side code: a Route Handler (app/api/.../route.ts)
// or a Server Component/Server Action.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
