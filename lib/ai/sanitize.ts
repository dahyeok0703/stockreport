/**
 * AI 입력으로 들어가기 전 원본 텍스트 길이/포맷 정제.
 * (AI 응답의 금지 표현 정제는 guardrails.ts 담당)
 */

export function clipText(text: string | null | undefined, max: number): string {
  if (!text) return "";
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

export function clipList(
  list: Array<string | null | undefined>,
  perItem: number,
  maxItems: number,
): string[] {
  return list
    .filter((s): s is string => Boolean(s))
    .slice(0, maxItems)
    .map((s) => clipText(s, perItem));
}

export function stableHash(input: unknown): string {
  const s = typeof input === "string" ? input : JSON.stringify(input);
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  // 음수 방지 + base36
  return (h >>> 0).toString(36);
}
