/**
 * AI 요약 캐시. 기존 lib/data/cache.ts (api_cache + in-memory)를 재사용합니다.
 * cache_key 형식: ai-summary:{type}:{market}:{symbol}:{inputHash}:{model}
 */

import { getCache, setCache } from "@/lib/data/cache";
import { stableHash } from "@/lib/ai/sanitize";
import { getAiConfig } from "@/lib/ai/config";
import type {
  AiSummaryRequest,
  AiSummaryResult,
} from "@/lib/ai/types";

export function buildCacheKey(
  req: AiSummaryRequest,
  model: string,
): { key: string; hash: string } {
  const hash = stableHash(req.inputData);
  return {
    key: `ai-summary:${req.type}:${req.market}:${req.symbol.toLowerCase()}:${hash}:${model}`,
    hash,
  };
}

export async function getCachedAiSummary(
  req: AiSummaryRequest,
  model: string,
): Promise<AiSummaryResult | null> {
  const { key } = buildCacheKey(req, model);
  const hit = await getCache<AiSummaryResult>(key);
  if (!hit) return null;
  // 캐시에서 가져온 값임을 표시
  return { ...hit, dataStatus: "cached" };
}

export async function setCachedAiSummary(
  req: AiSummaryRequest,
  model: string,
  result: AiSummaryResult,
): Promise<void> {
  const cfg = getAiConfig();
  const { key, hash } = buildCacheKey(req, model);
  await setCache(
    key,
    `ai:${cfg.provider}`,
    `/ai/${req.type}`,
    {
      market: req.market,
      symbol: req.symbol,
      type: req.type,
      inputHash: hash,
      model,
    },
    result,
    cfg.cacheTtlSeconds,
  );
}
