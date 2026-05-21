/**
 * 기능 플래그.
 *
 * 사용자 화면에는 절대 노출하지 마세요. 페이지 분기/안내 메시지 표시 여부 등
 * 내부 분기에만 사용합니다.
 *
 * 모든 플래그는 환경변수로 토글할 수 있고, 값이 없으면 안전한 기본값
 * (대부분 false)을 사용합니다. 실제 기능 연결 시 환경변수만 채우면 됩니다.
 */

export interface FeatureFlags {
  authEnabled: boolean;
  paymentsEnabled: boolean;
  aiSummaryEnabled: boolean;
  realDataEnabled: boolean;
  priceApiEnabled: boolean;
}

function boolEnv(name: string, fallback = false): boolean {
  const v = process.env[name];
  if (v == null) return fallback;
  return v.toLowerCase() === "true" || v === "1";
}

export function getFeatureFlags(): FeatureFlags {
  return {
    authEnabled:
      boolEnv("AUTH_ENABLED", false) &&
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
    paymentsEnabled: boolEnv("PAYMENTS_ENABLED", false),
    aiSummaryEnabled:
      boolEnv("AI_SUMMARY_ENABLED", false) &&
      Boolean(process.env.OPENAI_API_KEY),
    realDataEnabled: boolEnv("ENABLE_REAL_DATA", false),
    priceApiEnabled: boolEnv("ENABLE_PRICE_API", false),
  };
}
