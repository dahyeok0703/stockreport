import type { AiProvider } from "@/lib/ai/types";

export interface AiConfig {
  provider: AiProvider;
  openaiApiKey: string | null;
  model: string;
  enabled: boolean;
  maxInputChars: number;
  cacheTtlSeconds: number;
}

export function getAiConfig(): AiConfig {
  const rawProvider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const provider: AiProvider =
    rawProvider === "openai" || rawProvider === "mock"
      ? (rawProvider as AiProvider)
      : "openai";

  const openaiApiKey = process.env.OPENAI_API_KEY || null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const enabled =
    (process.env.AI_SUMMARY_ENABLED || "false").toLowerCase() === "true";
  const maxInputChars = positiveInt(process.env.AI_MAX_INPUT_CHARS, 12000);
  const ttlHours = positiveInt(process.env.AI_CACHE_TTL_HOURS, 24);

  return {
    provider,
    openaiApiKey,
    model,
    enabled,
    maxInputChars,
    cacheTtlSeconds: ttlHours * 3600,
  };
}

/**
 * 실제 AI 호출 가능 상태인지 판단.
 * - AI_SUMMARY_ENABLED=true
 * - provider=openai 이면 키가 있어야 함
 * - provider=mock 이면 키 없이도 동작 (단, dataStatus=mock)
 */
export function isAiCallable(cfg = getAiConfig()): boolean {
  if (!cfg.enabled) return false;
  if (cfg.provider === "openai") return Boolean(cfg.openaiApiKey);
  return true; // mock provider
}

function positiveInt(v: string | undefined, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}
