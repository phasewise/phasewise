"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-[11px] text-white/50 hover:text-white transition-colors disabled:opacity-50"
    >
      <LogOut className="w-3 h-3" strokeWidth={1.75} />
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
