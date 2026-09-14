"use client";

import { useEffect } from "react";
import { createClient } from "../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
    doLogout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
      <p className="text-sm text-[#64748B]">Logging out...</p>
    </main>
  );
}