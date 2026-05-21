/**
 * 외부 API/캐시 관련 환경변수 헬퍼.
 * 어떤 변수든 누락되어도 throw 하지 않고 null을 반환하며,
 * 호출부에서 fallback을 선택할 수 있게 합니다.
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function getOpenDartApiKey(): string | null {
  const key = process.env.OPEN_DART_API_KEY;
  if (!key) return null;
  return key;
}

export function getSecUserAgent(): string | null {
  const ua = process.env.SEC_USER_AGENT;
  if (!ua || !ua.includes("@")) {
    // SEC requires a User-Agent with a contact email. Reject otherwise.
    return null;
  }
  return ua;
}

export type NewsProviderCode = "mock" | "newsapi" | "brave" | "gnews";

export function getNewsProviderConfig(): {
  provider: NewsProviderCode;
  apiKey: string | null;
} {
  const raw = (process.env.NEWS_PROVIDER || "mock").toLowerCase();
  const provider: NewsProviderCode =
    raw === "newsapi" || raw === "brave" || raw === "gnews" ? raw : "mock";

  let apiKey: string | null = null;
  if (provider === "newsapi") apiKey = process.env.NEWS_API_KEY || null;
  if (provider === "brave") apiKey = process.env.BRAVE_SEARCH_API_KEY || null;
  if (provider === "gnews") apiKey = process.env.GNEWS_API_KEY || null;

  if (provider !== "mock" && !apiKey) {
    return { provider: "mock", apiKey: null };
  }
  return { provider, apiKey };
}

export function isRealDataEnabled(): boolean {
  return (process.env.ENABLE_REAL_DATA || "false").toLowerCase() === "true";
}

export interface RuntimeFlags {
  realData: boolean;
  dart: boolean;
  sec: boolean;
  newsProvider: NewsProviderCode;
  cacheBackend: "supabase" | "memory";
}

export function getRuntimeFlags(): RuntimeFlags {
  const realData = isRealDataEnabled();
  return {
    realData,
    dart: realData && Boolean(getOpenDartApiKey()),
    sec: realData && Boolean(getSecUserAgent()),
    newsProvider: realData ? getNewsProviderConfig().provider : "mock",
    cacheBackend:
      getSupabaseEnv() && getSupabaseServiceRoleKey() ? "supabase" : "memory",
  };
}
