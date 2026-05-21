"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAuth } from "@/lib/auth";
import { getPlanLimit } from "@/lib/planLimits";

export interface WatchlistRow {
  id: string;
  user_id: string;
  market: string;
  symbol: string;
  name: string;
  exchange: string | null;
  sector: string | null;
  created_at: string;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface WatchlistInput {
  market: string;
  symbol: string;
  name: string;
  exchange?: string | null;
  sector?: string | null;
}

export async function getMyWatchlist(): Promise<WatchlistRow[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];
  const { user } = await getCurrentAuth();
  if (!user) return [];

  const { data, error } = await supabase
    .from("watchlist_items")
    .select("id, user_id, market, symbol, name, exchange, sector, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as WatchlistRow[]) ?? [];
}

export async function getMyWatchlistSymbolKeys(): Promise<Set<string>> {
  const items = await getMyWatchlist();
  return new Set(items.map((i) => `${i.market}:${i.symbol.toLowerCase()}`));
}

export async function addToWatchlist(
  input: WatchlistInput,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "서비스 설정이 완료되지 않았습니다." };
  }
  const { user, profile } = await getCurrentAuth();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const limit = getPlanLimit(profile?.plan).watchlistLimit;

  const { count, error: countError } = await supabase
    .from("watchlist_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return { ok: false, error: "관심종목 정보를 불러오지 못했습니다." };
  }
  if ((count ?? 0) >= limit) {
    return {
      ok: false,
      error: `현재 요금제(${getPlanLimit(profile?.plan).label})에서 저장 가능한 관심종목 수(${limit}개)를 초과했습니다.`,
    };
  }

  const { error } = await supabase.from("watchlist_items").insert({
    user_id: user.id,
    market: input.market,
    symbol: input.symbol,
    name: input.name,
    exchange: input.exchange ?? null,
    sector: input.sector ?? null,
  });

  if (error) {
    // unique violation
    if ((error as { code?: string }).code === "23505") {
      return { ok: false, error: "이미 관심종목에 추가되어 있습니다." };
    }
    return { ok: false, error: "관심종목 추가에 실패했습니다." };
  }

  revalidatePath("/watchlist");
  revalidatePath(`/stocks/${input.market}/${input.symbol}`);
  revalidatePath("/account");
  return { ok: true };
}

export async function removeFromWatchlist(
  market: string,
  symbol: string,
): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "서비스 설정이 완료되지 않았습니다." };
  }
  const { user } = await getCurrentAuth();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("market", market)
    .eq("symbol", symbol);

  if (error) {
    return { ok: false, error: "관심종목 삭제에 실패했습니다." };
  }

  revalidatePath("/watchlist");
  revalidatePath(`/stocks/${market}/${symbol}`);
  revalidatePath("/account");
  return { ok: true };
}

export async function isInMyWatchlist(
  market: string,
  symbol: string,
): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return false;
  const { user } = await getCurrentAuth();
  if (!user) return false;

  const { data } = await supabase
    .from("watchlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("market", market)
    .eq("symbol", symbol)
    .maybeSingle();

  return Boolean(data);
}
