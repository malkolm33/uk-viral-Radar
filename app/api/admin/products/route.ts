import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase-admin";

// Mirrors the client-side password gate in app/admin/page.tsx. To be clear
// about what this does and doesn't protect: this string ships inside the
// browser JavaScript bundle either way, so it was never a real secret - the
// actual security boundary is that only the service role key (used below,
// server-side only) can write to "products" now that Row Level Security is
// enabled with no public insert/update/delete policy. This check just keeps
// this endpoint from being trivially discoverable/callable by anyone who
// doesn't already know the admin panel exists.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password, product } = body;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("products").insert([product]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { password, id } = body;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
