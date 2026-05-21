export interface BriefingItem {
  id: string;
  title: string;
  summary: string;
  tag?: string;
  time?: string;
}

export interface MarketBriefing {
  market: "한국" | "미국";
  headline: string;
  summary: string;
  indices: { name: string; value: string; change: string }[];
  topMoves: string[];
}

export const koreaBriefing: MarketBriefing = {
  market: "한국",
  headline: "한국 시장 주요 흐름 요약 (목업)",
  summary:
    "이날 국내 증시는 주요 업종별로 혼조된 흐름을 보였습니다. 반도체·자동차 등 대형주의 거래량 변화와 외국인·기관의 매매 동향이 함께 확인됩니다. 정확한 수치는 거래소 발표 및 원문 공시를 통해 확인이 필요합니다.",
  indices: [
    { name: "KOSPI", value: "2,712.45", change: "+0.42%" },
    { name: "KOSDAQ", value: "862.31", change: "-0.18%" },
    { name: "KOSPI200", value: "362.10", change: "+0.36%" },
  ],
  topMoves: [
    "반도체 업종 거래량 증가",
    "자동차 업종 외국인 매수 흐름",
    "2차전지 업종 변동성 확대",
  ],
};

export const usBriefing: MarketBriefing = {
  market: "미국",
  headline: "미국 시장 주요 흐름 요약 (목업)",
  summary:
    "전일 미국 증시는 빅테크 중심으로 흐름이 형성된 가운데 금리·환율 변수에 따른 변동이 있었습니다. 자세한 수치는 미국 거래소 공시 원문을 참고해 주세요.",
  indices: [
    { name: "S&P 500", value: "5,302.18", change: "+0.21%" },
    { name: "NASDAQ", value: "16,742.55", change: "+0.55%" },
    { name: "Dow Jones", value: "39,512.74", change: "-0.05%" },
  ],
  topMoves: [
    "AI 반도체 관련주 거래량 확대",
    "전기차 업종 혼조",
    "에너지 업종 일부 강세",
  ],
};

export const mainNews: BriefingItem[] = [
  {
    id: "n1",
    title: "AI 반도체 수요 흐름 관련 보도",
    summary: "데이터센터 AI 가속기 수요와 공급 흐름에 관한 시장 코멘트를 정리했습니다.",
    tag: "글로벌",
    time: "오전 09:12",
  },
  {
    id: "n2",
    title: "환율 흐름과 수출 기업 영향 관련 코멘트",
    summary: "원/달러 환율 변동과 국내 수출 기업의 실적 흐름 관련 시장 의견을 정리했습니다.",
    tag: "한국",
    time: "오전 09:24",
  },
  {
    id: "n3",
    title: "주요국 경제지표 발표 일정 정리",
    summary: "이번 주 발표 예정 주요 경제지표 일정과 시장 관측을 요약했습니다.",
    tag: "거시",
    time: "오전 09:35",
  },
];

export const mainDisclosures: BriefingItem[] = [
  {
    id: "d1",
    title: "삼성전자 — 자기주식 취득 결정",
    summary: "자기주식 취득 결정 공시 내용에 대한 요약입니다. 자세한 규모와 기간은 원문에서 확인하세요.",
    tag: "한국",
    time: "08:50",
  },
  {
    id: "d2",
    title: "Apple — 자사주 매입 프로그램 발표 (8-K)",
    summary: "자사주 매입 프로그램과 배당 관련 8-K 공시 요약입니다.",
    tag: "미국",
    time: "전일 발표",
  },
  {
    id: "d3",
    title: "현대차 — 주주환원 관련 결정 공시",
    summary: "주주환원 정책 관련 결정 사항이 담긴 공시 요약입니다.",
    tag: "한국",
    time: "09:10",
  },
];

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  region: "한국" | "미국" | "글로벌";
  type: "실적" | "경제지표" | "공시" | "배당·주총";
  note?: string;
}

export const earningsSchedule: ScheduleItem[] = [
  { id: "e1", date: "2026-05-22", title: "Nvidia 분기 실적 발표", region: "미국", type: "실적", note: "장 마감 후" },
  { id: "e2", date: "2026-05-23", title: "Palantir 투자자 컨퍼런스", region: "미국", type: "실적" },
  { id: "e3", date: "2026-05-24", title: "AMD 분기 실적 발표 (목업)", region: "미국", type: "실적" },
  { id: "e4", date: "2026-05-27", title: "현대차 IR Day (목업)", region: "한국", type: "실적" },
  { id: "e5", date: "2026-05-28", title: "SK하이닉스 컨퍼런스콜 (목업)", region: "한국", type: "실적" },
  { id: "e6", date: "2026-05-29", title: "Microsoft 투자자의 날 (목업)", region: "미국", type: "실적" },
  { id: "e7", date: "2026-06-02", title: "셀트리온 IR (목업)", region: "한국", type: "실적" },
];

export const economicSchedule: ScheduleItem[] = [
  { id: "m1", date: "2026-05-21", title: "미국 FOMC 의사록 공개", region: "미국", type: "경제지표" },
  { id: "m2", date: "2026-05-23", title: "한국 5월 소비자심리지수", region: "한국", type: "경제지표" },
  { id: "m3", date: "2026-05-24", title: "미국 5월 PMI 예비치", region: "미국", type: "경제지표" },
  { id: "m4", date: "2026-05-27", title: "한국 1분기 GDP 잠정치", region: "한국", type: "경제지표" },
  { id: "m5", date: "2026-05-30", title: "미국 4월 PCE 물가지수", region: "미국", type: "경제지표" },
  { id: "m6", date: "2026-06-01", title: "글로벌 5월 제조업 PMI", region: "글로벌", type: "경제지표" },
];

export const disclosureSchedule: ScheduleItem[] = [
  { id: "ds1", date: "2026-05-22", title: "코스피 200 정기변경 발표", region: "한국", type: "공시" },
  { id: "ds2", date: "2026-05-23", title: "한국 5월 공매도 잔고 공시", region: "한국", type: "공시" },
  { id: "ds3", date: "2026-05-28", title: "미국 4월 13F 공시 마감", region: "미국", type: "공시" },
  { id: "ds4", date: "2026-05-30", title: "셀트리온 임상 결과 공시 (목업)", region: "한국", type: "공시" },
];

export const dividendSchedule: ScheduleItem[] = [
  { id: "dv1", date: "2026-05-26", title: "Apple 배당 지급 기준일 (목업)", region: "미국", type: "배당·주총" },
  { id: "dv2", date: "2026-05-29", title: "삼성전자 분기 배당 공시 (목업)", region: "한국", type: "배당·주총" },
  { id: "dv3", date: "2026-06-03", title: "현대차 주주총회 (목업)", region: "한국", type: "배당·주총" },
];

export function getAllScheduleItems(): ScheduleItem[] {
  return [
    ...earningsSchedule,
    ...economicSchedule,
    ...disclosureSchedule,
    ...dividendSchedule,
  ];
}

export interface TopViewedStock {
  name: string;
  symbol: string;
  market: "kr" | "us";
  exchange: string;
  reason: string;
}

export const topViewedStocks: TopViewedStock[] = [
  {
    name: "Nvidia",
    symbol: "NVDA",
    market: "us",
    exchange: "NASDAQ",
    reason: "AI 가속기 관련 주요 보도",
  },
  {
    name: "삼성전자",
    symbol: "005930",
    market: "kr",
    exchange: "KRX",
    reason: "메모리 업황 관련 코멘트",
  },
  {
    name: "Tesla",
    symbol: "TSLA",
    market: "us",
    exchange: "NASDAQ",
    reason: "신모델 가격 정책 관련 보도",
  },
  {
    name: "NAVER",
    symbol: "035420",
    market: "kr",
    exchange: "KRX",
    reason: "AI 검색 업데이트 보도",
  },
];

export interface WatchlistItem {
  name: string;
  symbol: string;
  market: "kr" | "us";
  exchange: string;
  newDisclosureCount: number;
  newNewsCount: number;
  upcomingEarnings?: string;
}

export const mockWatchlist: WatchlistItem[] = [
  {
    name: "삼성전자",
    symbol: "005930",
    market: "kr",
    exchange: "KRX",
    newDisclosureCount: 2,
    newNewsCount: 5,
    upcomingEarnings: "2026-07-31 예정",
  },
  {
    name: "NAVER",
    symbol: "035420",
    market: "kr",
    exchange: "KRX",
    newDisclosureCount: 1,
    newNewsCount: 3,
  },
  {
    name: "Nvidia",
    symbol: "NVDA",
    market: "us",
    exchange: "NASDAQ",
    newDisclosureCount: 1,
    newNewsCount: 6,
    upcomingEarnings: "2026-05-22 예정",
  },
  {
    name: "Apple",
    symbol: "AAPL",
    market: "us",
    exchange: "NASDAQ",
    newDisclosureCount: 0,
    newNewsCount: 4,
  },
];
