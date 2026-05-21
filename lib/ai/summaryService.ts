/**
 * AI 요약 오케스트레이터.
 *
 * 흐름:
 *  1) 캐시 조회 (hit → 사용량 증가 없이 반환)
 *  2) AI 사용 가능 여부 확인 (env, login, plan limit)
 *  3) OpenAI provider 호출 (또는 mock)
 *  4) JSON 파싱 + 금지 표현 정제
 *  5) 캐시 저장, 사용량 증가
 *  6) AiSummaryEnvelope 반환
 *
 * 외부 호출 실패·금지 표현 정제는 모두 try/catch로 안전 처리됩니다.
 */

import { getAiConfig, isAiCallable } from "@/lib/ai/config";
import { sanitizePayload } from "@/lib/ai/guardrails";
import { generateMockAiSummary } from "@/lib/ai/mockAiProvider";
import { callOpenAi } from "@/lib/ai/openaiProvider";
import {
  compactFilings,
  compactFinancials,
  compactNews,
  compactStockReport,
  fitToBudget,
  type CompactStockInput,
} from "@/lib/ai/tokenBudget";
import {
  getCachedAiSummary,
  setCachedAiSummary,
} from "@/lib/data/aiSummaryCache";
import { getCurrentAuth } from "@/lib/auth";
import {
  getTodayAiUsageStatus,
  incrementAiSummaryView,
} from "@/lib/usage";
import type {
  AiSummaryEnvelope,
  AiSummaryPayload,
  AiSummaryRequest,
  AiSummaryResult,
} from "@/lib/ai/types";
import type {
  NormalizedFiling,
  NormalizedFinancialMetric,
  NormalizedNewsItem,
  NormalizedStockReport,
} from "@/lib/providers/types";

function logAiError(label: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.warn(`[ai] ${label}:`, (err as Error)?.message ?? err);
}

function buildResult(
  req: AiSummaryRequest,
  payload: AiSummaryPayload,
  model: string,
  dataStatus: AiSummaryResult["dataStatus"],
  blockedPhrasesFound: string[],
  warnings: string[],
): AiSummaryResult {
  return {
    summaryType: req.type,
    summary: payload.summary,
    keyPoints: payload.keyPoints,
    checkpoints: payload.checkpoints,
    sourceBasedNotes: payload.sourceBasedNotes,
    limitations: payload.limitations,
    containsInvestmentAdvice: payload.containsInvestmentAdvice,
    generatedAt: new Date().toISOString(),
    model,
    dataStatus,
    blockedPhrasesFound,
    warnings,
  };
}

function applyGuardrailsAndBuild(
  req: AiSummaryRequest,
  payload: AiSummaryPayload,
  model: string,
  dataStatus: AiSummaryResult["dataStatus"],
): AiSummaryResult {
  const sanitized = sanitizePayload(payload);
  const warnings: string[] = [];
  if (sanitized.changed) {
    warnings.push("AI 응답에서 금지 표현이 발견되어 중립 표현으로 자동 정제되었습니다.");
  }
  if (
    sanitized.value.containsInvestmentAdvice ||
    sanitized.blockedPhrasesFound.length > 0
  ) {
    warnings.push(
      "투자 판단으로 이어질 수 있는 표현이 감지되어 안전 표현으로 치환되었습니다.",
    );
  }
  return buildResult(
    req,
    sanitized.value,
    model,
    dataStatus,
    sanitized.blockedPhrasesFound,
    warnings,
  );
}

/**
 * 공용 진입점.
 *
 * - 캐시 → 호출 → 정제 → 저장 + 사용량 증가
 * - 로그인 안 한 경우: AI 호출 안 함, mock fallback
 * - 한도 초과: ok=false, reason="limit_exceeded" + fallback(mock) 동봉
 * - 비활성/키 없음: ok=true이지만 dataStatus="mock"
 */
export async function getAiSummary(
  req: AiSummaryRequest,
  opts: { force?: boolean } = {},
): Promise<AiSummaryEnvelope> {
  const cfg = getAiConfig();
  const model =
    cfg.provider === "openai" ? cfg.model : "mock";

  // 1) Cache
  if (!opts.force) {
    try {
      const cached = await getCachedAiSummary(req, model);
      if (cached) {
        return { ok: true, result: cached };
      }
    } catch (e) {
      logAiError("cache read", e);
    }
  }

  // 2) Login check (비로그인은 항상 mock — 사용량 추적 없음)
  const { user } = await getCurrentAuth();
  const isLoggedIn = Boolean(user);

  // 3) AI 사용 가능 여부
  const callable = isAiCallable(cfg);

  // 4) 한도 검사 (로그인 사용자만 적용)
  if (callable && isLoggedIn) {
    const usage = await getTodayAiUsageStatus();
    if (usage.exceeded) {
      const fallback = applyGuardrailsAndBuild(
        req,
        generateMockAiSummary(req),
        "mock",
        "mock",
      );
      return {
        ok: false,
        reason: "limit_exceeded",
        message:
          "오늘의 AI 요약 사용 한도를 모두 사용했습니다. 기본 리포트 정보는 계속 확인할 수 있습니다.",
        fallback,
      };
    }
  }

  // 5) Mock fallback (AI 비활성/키 없음/provider=mock)
  if (!callable || cfg.provider === "mock") {
    const mock = generateMockAiSummary(req);
    const result = applyGuardrailsAndBuild(req, mock, "mock", "mock");
    return {
      ok: true,
      result,
    };
  }

  // 6) 실제 OpenAI 호출
  let raw: AiSummaryPayload;
  try {
    raw = await callOpenAi(req);
  } catch (e) {
    logAiError("openai", e);
    const mock = generateMockAiSummary(req);
    const result = applyGuardrailsAndBuild(req, mock, model, "fallback");
    return {
      ok: true,
      result,
    };
  }

  // 7) 정제
  const result = applyGuardrailsAndBuild(req, raw, model, "ai");

  // 8) 캐시 저장 + 사용량 증가 (로그인 사용자만)
  try {
    await setCachedAiSummary(req, model, result);
  } catch (e) {
    logAiError("cache write", e);
  }
  if (isLoggedIn) {
    try {
      await incrementAiSummaryView();
    } catch (e) {
      logAiError("usage increment", e);
    }
  }

  return { ok: true, result };
}

// --------- 종목 도메인 헬퍼 ---------

function buildRequest(
  type: AiSummaryRequest["type"],
  stock: { market: "kr" | "us"; symbol: string; name: string },
  payload: CompactStockInput | Record<string, unknown>,
  userPlan: AiSummaryRequest["userPlan"],
): AiSummaryRequest {
  const cfg = getAiConfig();
  const budgeted = fitToBudget(payload as CompactStockInput, cfg.maxInputChars);
  return {
    type,
    market: stock.market,
    symbol: stock.symbol,
    companyName: stock.name,
    inputData: budgeted.payload as unknown as Record<string, unknown>,
    language: "ko",
    userPlan,
  };
}

export async function getStockIntegratedAiSummary(
  report: NormalizedStockReport,
  userPlan: AiSummaryRequest["userPlan"],
  opts: { force?: boolean } = {},
): Promise<AiSummaryEnvelope> {
  const input = compactStockReport(report);
  // 데이터가 너무 부족하면 reason=data_insufficient
  const haveAny =
    (input.filings?.length ?? 0) +
      (input.news?.length ?? 0) +
      (input.financials?.length ?? 0) >
    0;
  if (!haveAny) {
    return {
      ok: false,
      reason: "data_insufficient",
      message:
        "현재 AI 요약에 사용할 수 있는 데이터가 충분하지 않습니다. 원문 공시와 뉴스 링크를 함께 확인해 주세요.",
    };
  }
  const req = buildRequest(
    "integrated_report",
    report.stock,
    input,
    userPlan,
  );
  return getAiSummary(req, opts);
}

export async function getFilingsAiSummary(
  market: "kr" | "us",
  symbol: string,
  name: string,
  filings: NormalizedFiling[],
  userPlan: AiSummaryRequest["userPlan"],
  opts: { force?: boolean } = {},
): Promise<AiSummaryEnvelope> {
  if (!filings.length) {
    return {
      ok: false,
      reason: "data_insufficient",
      message: "공시 데이터가 없어 AI 요약을 생성할 수 없습니다.",
    };
  }
  const req = buildRequest(
    "filings",
    { market, symbol, name },
    { filings: compactFilings(filings) },
    userPlan,
  );
  return getAiSummary(req, opts);
}

export async function getNewsAiSummary(
  market: "kr" | "us",
  symbol: string,
  name: string,
  news: NormalizedNewsItem[],
  userPlan: AiSummaryRequest["userPlan"],
  opts: { force?: boolean } = {},
): Promise<AiSummaryEnvelope> {
  if (!news.length) {
    return {
      ok: false,
      reason: "data_insufficient",
      message: "뉴스 데이터가 없어 AI 요약을 생성할 수 없습니다.",
    };
  }
  const req = buildRequest(
    "news",
    { market, symbol, name },
    { news: compactNews(news) },
    userPlan,
  );
  return getAiSummary(req, opts);
}

export async function getFinancialsAiSummary(
  market: "kr" | "us",
  symbol: string,
  name: string,
  financials: NormalizedFinancialMetric[],
  userPlan: AiSummaryRequest["userPlan"],
  opts: { force?: boolean } = {},
): Promise<AiSummaryEnvelope> {
  if (!financials.length) {
    return {
      ok: false,
      reason: "data_insufficient",
      message: "재무 데이터가 없어 AI 요약을 생성할 수 없습니다.",
    };
  }
  const req = buildRequest(
    "financials",
    { market, symbol, name },
    { financials: compactFinancials(financials) },
    userPlan,
  );
  return getAiSummary(req, opts);
}
