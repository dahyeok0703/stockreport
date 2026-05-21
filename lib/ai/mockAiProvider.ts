/**
 * Mock AI provider — 키 없이 개발/테스트할 때 사용.
 * 입력 데이터에서 추출 가능한 정보만 정리해 결정론적이고 중립적인 요약을 반환합니다.
 * (AI 호출은 하지 않습니다)
 */

import type {
  AiSummaryPayload,
  AiSummaryRequest,
  AiSummaryType,
} from "@/lib/ai/types";

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export function generateMockAiSummary(req: AiSummaryRequest): AiSummaryPayload {
  const input = req.inputData ?? {};
  const filings = asArray<{ title?: string; formType?: string; filingDate?: string }>(
    (input as Record<string, unknown>).filings,
  );
  const news = asArray<{ title?: string; publisher?: string; publishedAt?: string }>(
    (input as Record<string, unknown>).news,
  );
  const financials = asArray<{ label?: string; value?: string; period?: string }>(
    (input as Record<string, unknown>).financials,
  );
  const earnings = (input as Record<string, unknown>).earnings as
    | { period?: string; revenue?: string | null; operatingProfit?: string | null; netProfit?: string | null }
    | null
    | undefined;
  const overview = asString((input as Record<string, unknown>).overview);

  const filingTitles = filings
    .slice(0, 3)
    .map((f) => [f.formType, f.title].filter(Boolean).join(" · "));
  const newsTitles = news.slice(0, 3).map((n) => n.title ?? "");
  const finBits = financials
    .slice(0, 3)
    .map((m) => `${m.label}: ${m.value}`)
    .filter(Boolean);

  const base = byType(req.type);

  const summaryParts: string[] = [];
  summaryParts.push(`${req.companyName}(${req.symbol})의 정보 요약입니다.`);
  if (overview) summaryParts.push(overview);
  if (filings.length)
    summaryParts.push(`최근 공시 ${filings.length}건이 확인됩니다.`);
  if (news.length)
    summaryParts.push(`최근 뉴스 ${news.length}건이 확인됩니다.`);
  if (earnings?.period) {
    const fin = [
      earnings.revenue && `매출 ${earnings.revenue}`,
      earnings.operatingProfit && `영업이익 ${earnings.operatingProfit}`,
      earnings.netProfit && `순이익 ${earnings.netProfit}`,
    ]
      .filter(Boolean)
      .join(", ");
    summaryParts.push(
      `${earnings.period} 실적: ${fin || "수치 확인 필요"}.`,
    );
  }
  summaryParts.push(
    "본 요약은 정보 제공용이며 매수·매도·보유를 권유하지 않습니다.",
  );

  const keyPoints: string[] = [];
  if (filingTitles.length) keyPoints.push(`최근 공시: ${filingTitles.join(" / ")}`);
  if (newsTitles.length) keyPoints.push(`최근 뉴스 키워드: ${newsTitles.join(" / ")}`);
  if (finBits.length) keyPoints.push(`재무: ${finBits.join(" / ")}`);
  if (!keyPoints.length) keyPoints.push("현재 충분한 데이터가 확인되지 않습니다.");

  return {
    summary: summaryParts.join(" "),
    keyPoints,
    checkpoints: [
      "공시 원문에서 구체 금액/기간/대상 확인",
      "뉴스 출처와 게재일 확인",
      "재무 항목의 단위와 기간 확인",
      ...base.extraCheckpoints,
    ].slice(0, 5),
    sourceBasedNotes: [
      "본 요약은 입력 데이터(공시·뉴스·실적 요약)만을 사용했습니다.",
      "AI 호출 없이 mock provider로 생성된 결과입니다.",
    ],
    limitations: [
      "데이터 누락·지연 가능성이 있습니다.",
      "원문 확인이 권장됩니다.",
    ],
    containsInvestmentAdvice: false,
  };
}

function byType(t: AiSummaryType): { extraCheckpoints: string[] } {
  switch (t) {
    case "filings":
      return {
        extraCheckpoints: ["공시 유형별 빈도 확인", "분기·반기·사업 보고서 일정 확인"],
      };
    case "news":
      return { extraCheckpoints: ["과장된 헤드라인 여부 확인"] };
    case "earnings":
      return { extraCheckpoints: ["전년 동기·전분기 비교 수치 확인"] };
    case "financials":
      return { extraCheckpoints: ["단일 시점 수치 대비 추세 확인"] };
    case "stock_overview":
      return { extraCheckpoints: ["사업 부문별 매출 비중 확인"] };
    case "integrated_report":
      return { extraCheckpoints: ["원문 출처 링크 함께 확인"] };
  }
}
