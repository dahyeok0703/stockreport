/**
 * AI 응답 본문에서 절대 등장하면 안 되는 표현.
 * 고지문이나 부정 문구("매수·매도를 권유하지 않습니다")는 별도 화이트리스트로
 * 컴포넌트 단에서 출력하며, AI 결과(summary/keyPoints/checkpoints/...) 안에서는
 * 다음 표현이 등장하지 않도록 후처리합니다.
 */

export const BLOCKED_PHRASES: ReadonlyArray<string> = [
  "추천",
  "비추천",
  "강력 매수",
  "강력매수",
  "강력 매도",
  "강력매도",
  "매수 추천",
  "매도 추천",
  "목표가",
  "적정가",
  "급등",
  "폭등",
  "대박",
  "수익 보장",
  "지금 사야",
  "지금 팔아야",
  "사도 좋다",
  "사도 좋습니다",
  "팔아야 한다",
  "팔아야 합니다",
  "보유하라",
  "보유하세요",
  "손절",
  "익절",
  "저평가 매수 기회",
  "저평가 매수",
  "고평가라 피해야",
  "고평가라 피하",
  "투자하세요",
  "투자하십시오",
  "담아도 좋다",
  "담아도 좋습니다",
  "몰빵",
  "단타 기회",
  // "매수"/"매도" 단독은 매우 일반적이어서 단어 경계로 별도 처리 (아래 strict 패턴)
];

/**
 * "매수" / "매도" 같은 짧은 단어는 다른 문맥(예: "외국인 매수 흐름")에서도 등장하므로,
 * 명령형/유도형 패턴일 때만 막습니다.
 */
const COMMAND_PATTERNS: ReadonlyArray<RegExp> = [
  /지금\s*(매수|매도)/g,
  /(매수|매도)\s*(권유|타이밍|시점|기회)/g,
  /(매수|매도)\s*(하세요|해도|해야)/g,
  /오늘\s*사야/g,
  /(반드시|꼭)\s*(사|매수|매도)/g,
];

const NEUTRAL_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/매수\s*기회/g, "시장 관심이 증가한 항목"],
  [/매도\s*시그널/g, "확인할 리스크가 있는 항목"],
  [/비추천/g, "확인할 리스크가 있는 항목"],
  [/추천\s*종목/g, "정보 제공용 항목"],
  [/추천/g, "정리"],
  [/목표가/g, "시장 전망 관련 외부 의견"],
  [/적정가/g, "시장 전망 관련 외부 의견"],
  [/(급등|폭등)\s*(예상|전망)/g, "가격 변동성이 커질 수 있는 정보"],
  [/(급등|폭등|대박)/g, "가격 변동성이 커질 수 있는 정보"],
  [/수익\s*보장/g, "투자 결과 보장 없음"],
  [/지금\s*사야\s*(한다|합니다)/g, "원문 확인이 필요한 정보"],
  [/지금\s*팔아야\s*(한다|합니다)/g, "투자 판단 전 확인할 정보"],
  [/사도\s*좋(다|습니다)/g, "원문 확인이 필요한 정보"],
  [/팔아야\s*(한다|합니다)/g, "투자 판단 전 확인할 정보"],
  [/보유하(라|세요)/g, "투자 판단 전 확인할 정보"],
  [/투자하(세요|십시오)/g, "원문 확인이 필요한 정보"],
  [/(담아도\s*좋(다|습니다))/g, "원문 확인이 필요한 정보"],
  [/몰빵/g, "비중 관련 확인 필요"],
  [/단타\s*기회/g, "단기 가격 변동 가능 정보"],
  [/손절/g, "손실 한도 관련 확인 필요"],
  [/익절/g, "수익 실현 관련 확인 필요"],
  [/강력\s*매수/g, "주요 관심 항목"],
  [/강력\s*매도/g, "확인할 리스크가 있는 항목"],
];

export interface SanitizeResult<T> {
  value: T;
  blockedPhrasesFound: string[];
  changed: boolean;
}

function sanitizeString(input: string): {
  out: string;
  blocked: string[];
  changed: boolean;
} {
  let out = input;
  const blocked: string[] = [];
  let changed = false;

  // 1) Neutral phrase rewriting
  for (const [pat, rep] of NEUTRAL_REPLACEMENTS) {
    if (pat.test(out)) {
      blocked.push(pat.source);
      out = out.replace(pat, rep);
      changed = true;
    }
  }

  // 2) Command pattern detection (replace whole sentence segment)
  for (const pat of COMMAND_PATTERNS) {
    if (pat.test(out)) {
      blocked.push(pat.source);
      out = out.replace(pat, "원문 확인이 필요한 정보");
      changed = true;
    }
  }

  // 3) Blocked phrase residue (after rewrites)
  for (const phrase of BLOCKED_PHRASES) {
    if (out.includes(phrase)) {
      blocked.push(phrase);
      out = out.split(phrase).join("(중립 표현으로 치환됨)");
      changed = true;
    }
  }

  return { out, blocked: Array.from(new Set(blocked)), changed };
}

export function sanitizeText(text: string): SanitizeResult<string> {
  const { out, blocked, changed } = sanitizeString(text);
  return { value: out, blockedPhrasesFound: blocked, changed };
}

export function sanitizeList(list: string[]): SanitizeResult<string[]> {
  const blockedAll: string[] = [];
  let changed = false;
  const out = list.map((s) => {
    const r = sanitizeString(s);
    if (r.changed) changed = true;
    blockedAll.push(...r.blocked);
    return r.out;
  });
  return {
    value: out,
    blockedPhrasesFound: Array.from(new Set(blockedAll)),
    changed,
  };
}

/**
 * 전체 페이로드 정제. summary / keyPoints / checkpoints / sourceBasedNotes /
 * limitations 모두 동일 규칙 적용.
 */
export function sanitizePayload<
  T extends {
    summary: string;
    keyPoints: string[];
    checkpoints: string[];
    sourceBasedNotes: string[];
    limitations: string[];
    containsInvestmentAdvice: boolean;
  },
>(p: T): { value: T; blockedPhrasesFound: string[]; changed: boolean } {
  const sSummary = sanitizeText(p.summary);
  const sKey = sanitizeList(p.keyPoints);
  const sCheck = sanitizeList(p.checkpoints);
  const sNotes = sanitizeList(p.sourceBasedNotes);
  const sLim = sanitizeList(p.limitations);

  const blocked = Array.from(
    new Set([
      ...sSummary.blockedPhrasesFound,
      ...sKey.blockedPhrasesFound,
      ...sCheck.blockedPhrasesFound,
      ...sNotes.blockedPhrasesFound,
      ...sLim.blockedPhrasesFound,
    ]),
  );
  const changed =
    sSummary.changed ||
    sKey.changed ||
    sCheck.changed ||
    sNotes.changed ||
    sLim.changed;

  return {
    value: {
      ...p,
      summary: sSummary.value,
      keyPoints: sKey.value,
      checkpoints: sCheck.value,
      sourceBasedNotes: sNotes.value,
      limitations: sLim.value,
      containsInvestmentAdvice:
        p.containsInvestmentAdvice || blocked.length > 0,
    },
    blockedPhrasesFound: blocked,
    changed,
  };
}
