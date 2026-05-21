import type { StockMarket } from "@/lib/providers/types";
import type { PlanCode } from "@/lib/planLimits";

export type AiProvider = "openai" | "mock";

export type AiSummaryType =
  | "stock_overview"
  | "filings"
  | "news"
  | "earnings"
  | "financials"
  | "integrated_report";

export type AiSummaryDataStatus =
  | "ai"
  | "mock"
  | "cached"
  | "fallback"
  | "error";

export interface AiSummaryRequest {
  type: AiSummaryType;
  market: StockMarket;
  symbol: string;
  companyName: string;
  /** 압축·정규화된 입력 데이터. raw response를 그대로 넣지 마세요. */
  inputData: Record<string, unknown>;
  language?: "ko" | "en";
  /** summary 본문 최대 문자 수 가이드 */
  maxLength?: number;
  /** 사용자 요금제 — 한도 검증에 사용 */
  userPlan?: PlanCode;
}

export interface AiSummaryPayload {
  summary: string;
  keyPoints: string[];
  checkpoints: string[];
  sourceBasedNotes: string[];
  limitations: string[];
  containsInvestmentAdvice: boolean;
}

export interface AiSummaryResult extends AiSummaryPayload {
  summaryType: AiSummaryType;
  generatedAt: string;
  model: string;
  dataStatus: AiSummaryDataStatus;
  blockedPhrasesFound: string[];
  /** 사용자에게 표시할 경고 메시지 (예: "AI 응답에서 금지 표현이 정제되었습니다") */
  warnings: string[];
}

export interface AiSummaryEnvelope {
  ok: boolean;
  result?: AiSummaryResult;
  /** ok=false일 때의 상위 상태 (limit_exceeded, disabled, login_required, error, data_insufficient) */
  reason?:
    | "limit_exceeded"
    | "disabled"
    | "login_required"
    | "data_insufficient"
    | "error";
  message?: string;
  /** 한도/비활성 시에도 기존 데이터로 만든 fallback 요약을 함께 제공 */
  fallback?: AiSummaryResult;
}
