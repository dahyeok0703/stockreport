"use client";

/**
 * 데모 모드 관심종목 저장소 — 브라우저 localStorage 기반.
 *
 * Supabase 환경변수가 없거나 로그인 기능을 비활성화한 상태에서도 사용자가
 * 관심종목을 추가·삭제·조회할 수 있도록 합니다. 같은 브라우저 내에서만
 * 보존되며, 로그아웃 개념이 없고 사용량 제한도 적용되지 않습니다.
 *
 * 후속 단계에서 Supabase가 켜지면 lib/watchlist.ts(서버 액션)로 다시
 * 전환할 수 있도록 구조는 유지합니다.
 */

import { useCallback, useEffect, useState } from "react";

export interface LocalWatchlistItem {
  key: string; // "{market}:{symbol}"
  market: "kr" | "us";
  symbol: string;
  name: string;
  exchange?: string | null;
  sector?: string | null;
  addedAt: string;
}

const STORAGE_KEY = "stockreport:watchlist:v1";
const CHANNEL = "stockreport:watchlist:changed";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): LocalWatchlistItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is LocalWatchlistItem =>
        x &&
        typeof x === "object" &&
        typeof x.key === "string" &&
        typeof x.symbol === "string" &&
        (x.market === "kr" || x.market === "us"),
    );
  } catch {
    return [];
  }
}

function writeAll(items: LocalWatchlistItem[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CHANNEL));
  } catch {
    // quota exceeded 등은 조용히 무시 (데모 모드)
  }
}

export function buildKey(market: "kr" | "us", symbol: string): string {
  return `${market}:${symbol.toLowerCase()}`;
}

export function listLocalWatchlist(): LocalWatchlistItem[] {
  return readAll().sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
}

export function addLocalWatchlist(
  item: Omit<LocalWatchlistItem, "key" | "addedAt">,
): { ok: true } | { ok: false; reason: "duplicate" | "limit" } {
  const items = readAll();
  const key = buildKey(item.market, item.symbol);
  if (items.some((i) => i.key === key)) {
    return { ok: false, reason: "duplicate" };
  }
  if (items.length >= 50) {
    // 데모 모드 자체 상한
    return { ok: false, reason: "limit" };
  }
  const next: LocalWatchlistItem[] = [
    ...items,
    {
      ...item,
      key,
      addedAt: new Date().toISOString(),
    },
  ];
  writeAll(next);
  return { ok: true };
}

export function removeLocalWatchlist(market: "kr" | "us", symbol: string) {
  const key = buildKey(market, symbol);
  const items = readAll().filter((i) => i.key !== key);
  writeAll(items);
}

export function isInLocalWatchlist(
  market: "kr" | "us",
  symbol: string,
): boolean {
  const key = buildKey(market, symbol);
  return readAll().some((i) => i.key === key);
}

// ---------- React 통합 ----------

const EMPTY: LocalWatchlistItem[] = [];

export function useLocalWatchlist(): {
  items: LocalWatchlistItem[];
  hydrated: boolean;
} {
  const [items, setItems] = useState<LocalWatchlistItem[]>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(listLocalWatchlist());
    setHydrated(true);
    const onChange = () => setItems(listLocalWatchlist());
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANNEL, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(CHANNEL, onChange);
    };
  }, []);

  return { items, hydrated };
}

export function useIsInLocalWatchlist(
  market: "kr" | "us",
  symbol: string,
): { isIn: boolean; hydrated: boolean } {
  const { items, hydrated } = useLocalWatchlist();
  const key = buildKey(market, symbol);
  return {
    isIn: items.some((i) => i.key === key),
    hydrated,
  };
}

export function useAddRemoveWatchlist() {
  const add = useCallback(
    (item: Omit<LocalWatchlistItem, "key" | "addedAt">) =>
      addLocalWatchlist(item),
    [],
  );
  const remove = useCallback(
    (market: "kr" | "us", symbol: string) =>
      removeLocalWatchlist(market, symbol),
    [],
  );
  return { add, remove };
}
