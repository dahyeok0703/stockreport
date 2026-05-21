/**
 * 외부 API 응답 캐싱.
 *
 * 1순위: Supabase `api_cache` 테이블 (service role 클라이언트로 접근)
 * 2순위: in-memory Map (개발용 / Supabase 미설정 시)
 *
 * 두 백엔드 모두 TTL 만료 시 자동으로 무효화됩니다.
 */

import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const CACHE_TTL_SECONDS = {
  /** OpenDART 공시 목록 */
  dartDisclosures: 6 * 3600,
  /** OpenDART 재무 데이터 */
  dartFinancials: 24 * 3600,
  /** SEC submissions */
  secSubmissions: 6 * 3600,
  /** SEC companyfacts */
  secCompanyFacts: 24 * 3600,
  /** 뉴스 검색 */
  news: 1 * 3600,
  /** 종목 매핑 */
  stockMappings: 7 * 24 * 3600,
} as const;

interface MemoryEntry {
  value: unknown;
  expiresAt: number;
}

const memory = new Map<string, MemoryEntry>();

function nowMs() {
  return Date.now();
}

export async function getCache<T>(cacheKey: string): Promise<T | null> {
  // 1) Supabase
  const supabase = createSupabaseServiceClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from("api_cache")
        .select("response, expires_at")
        .eq("cache_key", cacheKey)
        .maybeSingle();

      if (data) {
        const expiresAt = new Date(data.expires_at).getTime();
        if (expiresAt > nowMs()) {
          return data.response as T;
        }
      }
    } catch {
      // fall through to memory
    }
  }

  // 2) Memory
  const entry = memory.get(cacheKey);
  if (entry && entry.expiresAt > nowMs()) {
    return entry.value as T;
  }
  if (entry) memory.delete(cacheKey);
  return null;
}

export async function setCache<T>(
  cacheKey: string,
  provider: string,
  endpoint: string,
  params: Record<string, unknown> | null,
  response: T,
  ttlSeconds: number,
): Promise<void> {
  const expiresAtIso = new Date(nowMs() + ttlSeconds * 1000).toISOString();

  // Always populate memory cache for the current process.
  memory.set(cacheKey, {
    value: response,
    expiresAt: nowMs() + ttlSeconds * 1000,
  });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return;

  try {
    await supabase.from("api_cache").upsert(
      {
        cache_key: cacheKey,
        provider,
        endpoint,
        params: params ?? {},
        response,
        expires_at: expiresAtIso,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch {
    // ignore — memory cache still served the value.
  }
}

export async function getOrSetCache<T>(
  cacheKey: string,
  provider: string,
  endpoint: string,
  params: Record<string, unknown> | null,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await getCache<T>(cacheKey);
  if (cached !== null) return cached;
  const fresh = await fetcher();
  await setCache(cacheKey, provider, endpoint, params, fresh, ttlSeconds);
  return fresh;
}

export function _clearMemoryCacheForTest() {
  memory.clear();
}
