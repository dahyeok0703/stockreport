import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (code) {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.auth.exchangeCodeForSession(code);
      } catch {
        return NextResponse.redirect(
          new URL(`/login?error=auth_callback_failed`, url.origin),
        );
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
