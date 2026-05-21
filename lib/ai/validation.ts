import type { AiSummaryPayload } from "@/lib/ai/types";

const EMPTY_PAYLOAD: AiSummaryPayload = {
  summary: "",
  keyPoints: [],
  checkpoints: [],
  sourceBasedNotes: [],
  limitations: [],
  containsInvestmentAdvice: false,
};

/**
 * 모델 응답 문자열에서 첫 JSON 객체를 추출 → 파싱 → AiSummaryPayload 형태로 정규화.
 * 파싱 실패 시 null.
 */
export function parseAiJson(raw: string): AiSummaryPayload | null {
  if (!raw) return null;
  const text = raw.trim();

  // 1) 직접 파싱
  try {
    const obj = JSON.parse(text);
    return normalize(obj);
  } catch {
    // continue
  }

  // 2) 코드블록/잡문 포함 → 첫 `{` ~ 마지막 `}` 슬라이스
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  const candidate = text.slice(first, last + 1);
  try {
    const obj = JSON.parse(candidate);
    return normalize(obj);
  } catch {
    return null;
  }
}

function normalize(obj: unknown): AiSummaryPayload | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;

  const summary = stringOr(o.summary, "");
  if (!summary) return null;

  return {
    summary,
    keyPoints: arrayOfStrings(o.keyPoints),
    checkpoints: arrayOfStrings(o.checkpoints),
    sourceBasedNotes: arrayOfStrings(o.sourceBasedNotes),
    limitations: arrayOfStrings(o.limitations),
    containsInvestmentAdvice: Boolean(o.containsInvestmentAdvice),
  };
}

function stringOr(v: unknown, fallback: string): string {
  if (typeof v === "string") return v.trim();
  return fallback;
}

function arrayOfStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : null))
    .filter((s): s is string => Boolean(s));
}

export { EMPTY_PAYLOAD };
