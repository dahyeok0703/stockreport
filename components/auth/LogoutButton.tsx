"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function LogoutButton({
  className,
  children = "로그아웃",
  redirectTo = "/",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.replace(redirectTo);
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.replace(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className ?? "btn-ghost text-sm"}
    >
      {loading ? "로그아웃 중…" : children}
    </button>
  );
}
