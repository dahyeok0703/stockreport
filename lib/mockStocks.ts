export type MarketCode = "kr" | "us";

export interface Disclosure {
  id: string;
  title: string;
  date: string;
  summary: string;
  checkpoints: string[];
  sourceUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  press: string;
  date: string;
  summary: string;
  keywords: string[];
  sourceUrl: string;
}

export interface EarningsItem {
  id: string;
  period: string;
  revenue: string;
  operatingProfit: string;
  netProfit: string;
  yoyRevenue: string;
  yoyOperatingProfit: string;
  checkpoints: string[];
}

export interface FinancialMetric {
  label: string;
  value: string;
  note?: string;
  isReference?: boolean;
}

export interface SourceLink {
  label: string;
  href: string;
  category: "공시" | "뉴스" | "실적";
}

export interface PriceSnapshot {
  currency: "KRW" | "USD";
  /** 현재가처럼 보이는 데모 값 */
  current: number;
  /** 전일 대비 변화 (절대값) */
  changeAbs: number;
  /** 전일 대비 변화 (퍼센트, +/-) */
  changePct: number;
  /** 거래량 데모 */
  volume: number;
  /** 시가총액 데모 — 사람이 읽기 좋은 문자열 */
  marketCap: string;
  /** 데이터 기준 시각 (사용자 표시용 문자열) */
  asOf: string;
}

export interface Checkpoints {
  disclosure: string[];
  earnings: string[];
  news: string[];
}

export interface RevenueSegment {
  name: string;
  share: string;
  note?: string;
}

export interface Stock {
  name: string;
  symbol: string;
  market: MarketCode;
  country: "한국" | "미국";
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  businessSummary: string;
  keyProducts: string[];
  keyMarkets: string[];
  revenueStructure: RevenueSegment[];
  recentDisclosures: Disclosure[];
  recentNews: NewsItem[];
  earningsSummary: EarningsItem;
  financialMetrics: FinancialMetric[];
  priceSnapshot?: PriceSnapshot;
  checkpoints: Checkpoints;
  sourceLinks: SourceLink[];
  lastUpdated: string;
}

const sharedDisclaimerCheckpoints = [
  "공시·뉴스·실적자료의 원문을 직접 확인할 것",
  "AI 요약은 정보 제공용이며 판단의 책임은 이용자에게 있음",
];

export const mockStocks: Stock[] = [
  {
    name: "삼성전자",
    symbol: "005930",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "IT",
    industry: "반도체·전자제품",
    description:
      "메모리 반도체, 시스템 반도체, 스마트폰, 가전을 아우르는 종합 전자기업",
    businessSummary:
      "삼성전자는 메모리(DRAM·NAND)와 파운드리를 포함한 반도체 사업(DS 부문), 스마트폰 및 네트워크 사업(MX 부문), TV·생활가전(VD/DA 부문), 디스플레이(SDC), 하만(전장)을 운영하는 글로벌 전자기업입니다.",
    keyProducts: [
      "DRAM·NAND 메모리 반도체",
      "파운드리·시스템 LSI",
      "갤럭시 스마트폰·태블릿",
      "TV·디스플레이",
      "생활가전",
    ],
    keyMarkets: ["한국", "북미", "중국", "유럽", "신흥국"],
    revenueStructure: [
      { name: "DS(반도체)", share: "약 35%", note: "메모리 + 파운드리" },
      { name: "MX(모바일)", share: "약 38%" },
      { name: "VD/DA(영상·가전)", share: "약 18%" },
      { name: "하만(전장)", share: "약 6%" },
      { name: "기타", share: "약 3%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "주요사항보고서(자기주식 취득 결정)",
        date: "2026-05-12",
        summary:
          "자기주식 일정 규모를 정해진 기간 동안 시장에서 취득하기로 결정한 내용에 대한 공시입니다. 자세한 취득 규모와 기간, 목적은 원문에서 확인할 수 있습니다.",
        checkpoints: [
          "취득 규모와 취득 기간",
          "취득 목적(주주환원/임직원 보상 등)",
          "자사주 처분 계획 여부",
        ],
        sourceUrl: "#",
      },
      {
        id: "d2",
        title: "현금·현물 배당 결정",
        date: "2026-04-29",
        summary:
          "정기 배당 관련 결정 사항에 대한 공시입니다. 배당 기준일, 배당금 총액, 1주당 배당금 등이 포함되어 있습니다.",
        checkpoints: [
          "1주당 배당금 및 배당 총액",
          "배당 기준일·지급 예정일",
          "전년 동기 대비 배당 변화",
        ],
        sourceUrl: "#",
      },
      {
        id: "d3",
        title: "분기보고서 제출",
        date: "2026-04-25",
        summary:
          "직전 분기의 매출, 영업이익, 사업 부문별 실적, 주요 사업 현황이 담긴 분기보고서가 제출되었습니다.",
        checkpoints: [
          "사업부문별 매출/이익 추세",
          "메모리·파운드리 가동률과 재고",
          "환율 영향과 일회성 비용",
        ],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "메모리 업황 회복 흐름과 관련된 시장 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-18",
        summary:
          "메모리 가격 추세와 데이터센터 수요 동향에 대한 시장 관측을 정리했습니다. 실제 수치는 원문 및 공식 발표를 통해 확인해야 합니다.",
        keywords: ["메모리", "DRAM", "AI 서버", "재고"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "파운드리 고객사 동향 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary:
          "최근 거론된 파운드리 고객사 관련 동향과 양산 일정에 관한 보도 내용을 요약했습니다.",
        keywords: ["파운드리", "양산", "고객사"],
        sourceUrl: "#",
      },
      {
        id: "n3",
        title: "신제품 모바일 라인업 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-10",
        summary:
          "신규 모바일 제품 라인업 및 출시 일정과 관련된 코멘트 내용을 정리했습니다.",
        keywords: ["갤럭시", "신제품", "출시"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 71.0조 원",
      operatingProfit: "약 6.6조 원",
      netProfit: "약 5.4조 원",
      yoyRevenue: "+12.1%",
      yoyOperatingProfit: "+930.2%",
      checkpoints: [
        "메모리 가격 회복으로 DS 부문 흑자 전환 흐름",
        "MX 부문 신제품 효과 지속 여부",
        "환율과 일회성 비용 영향",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+12.1%" },
      { label: "영업이익률", value: "약 9.3%" },
      { label: "부채비율", value: "약 25%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "15.4배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "1.3배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: [
        "자사주 취득·소각 정책의 지속성",
        "분기보고서상 부문별 실적 변동",
      ],
      earnings: [
        "메모리 가격 회복 강도와 지속성",
        "파운드리 가동률·고객 다변화",
      ],
      news: [
        "AI 서버 수요 흐름",
        "환율·지정학적 변수",
      ],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "NAVER",
    symbol: "035420",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "커뮤니케이션서비스",
    industry: "인터넷·플랫폼",
    description:
      "검색, 커머스, 핀테크, 콘텐츠, 클라우드/AI를 운영하는 국내 대표 인터넷 플랫폼",
    businessSummary:
      "NAVER는 검색·디스플레이 광고, 커머스(스마트스토어·브랜드스토어), 핀테크(네이버페이), 콘텐츠(웹툰·스노우), 클라우드/AI(하이퍼클로바X) 등 다섯 개 주요 사업 부문을 운영합니다.",
    keyProducts: [
      "검색·디스플레이 광고",
      "스마트스토어·브랜드스토어",
      "네이버페이",
      "네이버웹툰",
      "네이버클라우드·하이퍼클로바X",
    ],
    keyMarkets: ["한국", "일본(라인 협업)", "북미(웹툰)"],
    revenueStructure: [
      { name: "서치플랫폼(광고)", share: "약 39%" },
      { name: "커머스", share: "약 27%" },
      { name: "핀테크", share: "약 14%" },
      { name: "콘텐츠", share: "약 13%" },
      { name: "클라우드·기타", share: "약 7%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-08",
        summary:
          "분기 매출, 영업이익, 사업부문별 실적이 포함된 분기보고서가 제출되었습니다.",
        checkpoints: [
          "커머스 거래액 추세",
          "광고·핀테크 성장률",
          "AI 관련 투자 규모",
        ],
        sourceUrl: "#",
      },
      {
        id: "d2",
        title: "타법인 주식 및 출자증권 취득결정",
        date: "2026-04-21",
        summary:
          "전략적 투자 및 지분 취득과 관련한 결정 사항이 공시되었습니다.",
        checkpoints: [
          "투자 대상 회사와 사업 영역",
          "투자 금액과 지분율",
          "기존 사업과의 시너지",
        ],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "AI 검색 및 하이퍼클로바X 관련 업데이트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-17",
        summary:
          "검색에 적용되는 AI 기능과 하이퍼클로바X 모델 업데이트 관련 보도 내용을 정리했습니다.",
        keywords: ["AI", "하이퍼클로바X", "검색"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "커머스 거래액 흐름 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-12",
        summary:
          "최근 분기 커머스 거래액 추세와 시장 관측 의견을 요약했습니다.",
        keywords: ["커머스", "거래액", "스마트스토어"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 2.62조 원",
      operatingProfit: "약 4,300억 원",
      netProfit: "약 3,100억 원",
      yoyRevenue: "+10.2%",
      yoyOperatingProfit: "+16.4%",
      checkpoints: [
        "광고·커머스의 성장 강도",
        "AI 투자 비용의 영업이익 영향",
        "핀테크·콘텐츠 수익화 추이",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+10.2%" },
      { label: "영업이익률", value: "약 16.4%" },
      { label: "부채비율", value: "약 38%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "22.8배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "1.1배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["전략적 투자 공시의 사업 시너지", "자사주 정책 변화"],
      earnings: ["광고·커머스 성장 강도", "AI 투자 부담"],
      news: ["AI 검색 사용자 반응", "글로벌 웹툰 트래픽"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "현대차",
    symbol: "005380",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "경기소비재",
    industry: "자동차",
    description:
      "내연기관·하이브리드·전기차를 포괄하는 글로벌 완성차 제조 기업",
    businessSummary:
      "현대차는 승용·상용 차량과 전기차(아이오닉 시리즈), 수소전기차, 제네시스 브랜드, 미래모빌리티(UAM·로보틱스 등)를 운영하는 글로벌 완성차 그룹입니다.",
    keyProducts: [
      "내연기관 승용·SUV",
      "하이브리드/전기차(아이오닉)",
      "수소전기차(넥쏘)",
      "제네시스 프리미엄 라인업",
      "상용차·미래 모빌리티",
    ],
    keyMarkets: ["한국", "북미", "유럽", "인도", "신흥국"],
    revenueStructure: [
      { name: "북미", share: "약 35%" },
      { name: "한국 내수", share: "약 22%" },
      { name: "유럽", share: "약 17%" },
      { name: "인도·신흥국", share: "약 18%" },
      { name: "금융·기타", share: "약 8%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-09",
        summary:
          "분기 매출, 영업이익, 지역별 판매대수 등이 포함된 분기보고서가 제출되었습니다.",
        checkpoints: [
          "지역별 판매대수 추이",
          "전기차 비중과 수익성",
          "원/달러 환율 영향",
        ],
        sourceUrl: "#",
      },
      {
        id: "d2",
        title: "주주환원 관련 결정",
        date: "2026-04-18",
        summary: "배당·자사주 등 주주환원 정책 관련 결정 사항이 공시되었습니다.",
        checkpoints: ["배당 규모", "자사주 취득·소각 여부", "환원 가이드라인 변화"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "북미 시장 판매 흐름 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-16",
        summary: "북미 시장에서의 판매와 인센티브 동향에 대한 시장 코멘트입니다.",
        keywords: ["북미", "판매", "인센티브"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "전기차 라인업 업데이트 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-11",
        summary: "신규 전기차 라인업과 출시 일정 관련 보도 내용을 정리했습니다.",
        keywords: ["전기차", "아이오닉", "라인업"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 41조 원",
      operatingProfit: "약 3.6조 원",
      netProfit: "약 3.0조 원",
      yoyRevenue: "+7.6%",
      yoyOperatingProfit: "+2.3%",
      checkpoints: [
        "고부가 차종 비중과 ASP",
        "전기차 수익성 추이",
        "환율·원자재 가격 영향",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+7.6%" },
      { label: "영업이익률", value: "약 8.8%" },
      { label: "부채비율", value: "약 165%", note: "금융 부문 포함" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "5.4배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "0.7배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["주주환원 가이드라인 변화", "지역별 판매 공시"],
      earnings: ["고부가 차종 ASP 흐름", "전기차 수익성"],
      news: ["미국 관세·인센티브 정책", "환율 흐름"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "카카오",
    symbol: "035720",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "커뮤니케이션서비스",
    industry: "인터넷·플랫폼",
    description:
      "카카오톡 기반의 메신저·광고·커머스·핀테크·콘텐츠 플랫폼 운영 기업",
    businessSummary:
      "카카오는 카카오톡을 중심으로 톡비즈(광고·커머스), 모빌리티, 페이, 게임, 엔터테인먼트, 픽코마 등 다양한 사업을 운영합니다.",
    keyProducts: [
      "카카오톡·톡비즈 광고",
      "카카오모빌리티(택시·대리)",
      "카카오페이·뱅크",
      "카카오게임즈",
      "카카오엔터테인먼트(웹툰·음악)",
    ],
    keyMarkets: ["한국", "일본(픽코마)", "동남아"],
    revenueStructure: [
      { name: "톡비즈(광고·커머스)", share: "약 28%" },
      { name: "포털비즈", share: "약 4%" },
      { name: "콘텐츠(스토리·게임·뮤직·미디어)", share: "약 48%" },
      { name: "플랫폼 기타(모빌리티·페이 등)", share: "약 20%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-10",
        summary: "분기 매출·영업이익과 사업부문별 실적이 포함된 분기보고서가 제출되었습니다.",
        checkpoints: ["톡비즈 성장률", "콘텐츠 사업의 수익성", "신규 AI 서비스 투자"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "AI 서비스 출시 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-14",
        summary: "신규 AI 서비스 로드맵 및 적용 영역 관련 보도 내용을 정리했습니다.",
        keywords: ["AI", "카카오톡", "신규 서비스"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 2.05조 원",
      operatingProfit: "약 1,200억 원",
      netProfit: "약 800억 원",
      yoyRevenue: "+8.2%",
      yoyOperatingProfit: "+88.5%",
      checkpoints: [
        "톡비즈 광고·커머스 성장 강도",
        "콘텐츠 사업의 수익성 회복",
        "AI 서비스 투자 부담",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+8.2%" },
      { label: "영업이익률", value: "약 5.9%" },
      { label: "부채비율", value: "약 60%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "55.2배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "1.6배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["계열사 구조개편 관련 공시", "주주환원 정책"],
      earnings: ["광고·커머스 성장률", "콘텐츠 수익성"],
      news: ["AI 서비스 사용자 반응", "규제 이슈"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "Apple",
    symbol: "AAPL",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    description:
      "iPhone, Mac, iPad, Wearables, 서비스(앱스토어·iCloud) 등을 운영하는 글로벌 IT 기업",
    businessSummary:
      "Apple은 iPhone을 중심으로 Mac, iPad, Wearables(워치·에어팟), 서비스(앱스토어·iCloud·Apple TV+ 등)를 판매하는 글로벌 IT 기업입니다.",
    keyProducts: [
      "iPhone",
      "Mac / MacBook",
      "iPad",
      "Wearables(Apple Watch, AirPods)",
      "Services(App Store, iCloud, Apple TV+)",
    ],
    keyMarkets: ["미국", "중국", "유럽", "일본", "신흥국"],
    revenueStructure: [
      { name: "iPhone", share: "약 52%" },
      { name: "Services", share: "약 22%" },
      { name: "Wearables·Home·Accessories", share: "약 9%" },
      { name: "Mac", share: "약 8%" },
      { name: "iPad", share: "약 7%" },
      { name: "기타", share: "약 2%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-05-02",
        summary: "최근 분기 매출, 제품·서비스별 실적, 지역별 매출이 포함된 분기 보고서가 제출되었습니다.",
        checkpoints: ["iPhone 매출 추이", "서비스 매출 성장률", "중국 매출 흐름"],
        sourceUrl: "#",
      },
      {
        id: "d2",
        title: "8-K (자사주 매입 프로그램 발표)",
        date: "2026-04-30",
        summary: "정기 자사주 매입 프로그램과 배당 관련 발표 내용에 대한 공시입니다.",
        checkpoints: ["자사주 매입 규모", "배당 인상률", "주주환원 가이드라인"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "AI 기능 통합 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-16",
        summary: "운영체제 단의 AI 기능 통합 로드맵에 대한 시장 코멘트입니다.",
        keywords: ["AI", "iOS", "Apple Intelligence"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "중국 시장 판매 흐름 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-13",
        summary: "중국 시장 iPhone 판매 흐름과 현지 경쟁사 동향에 대한 보도 내용입니다.",
        keywords: ["중국", "iPhone", "경쟁"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q2 (목업)",
      revenue: "약 $92.5B",
      operatingProfit: "약 $28.7B",
      netProfit: "약 $24.1B",
      yoyRevenue: "+3.1%",
      yoyOperatingProfit: "+5.2%",
      checkpoints: [
        "iPhone 매출 회복 여부",
        "서비스 매출 성장 지속성",
        "중국 매출 흐름",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+3.1%" },
      { label: "영업이익률", value: "약 31.0%" },
      { label: "부채비율", value: "약 145%", note: "자사주 매입 영향" },
      { label: "영업현금흐름", value: "매우 양호 (목업)" },
      { label: "P/E", value: "30.2배", isReference: true, note: "참고 지표" },
      { label: "P/B", value: "47.0배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["자사주 매입·배당 가이드라인 변화", "10-Q 상의 세그먼트별 흐름"],
      earnings: ["iPhone 매출 회복 강도", "서비스 매출 성장"],
      news: ["AI 기능 사용자 반응", "지정학·규제 이슈"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Nvidia",
    symbol: "NVDA",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    description:
      "AI 가속기(GPU)와 데이터센터 컴퓨팅, 그래픽·자율주행 솔루션을 제공하는 반도체 기업",
    businessSummary:
      "Nvidia는 데이터센터 AI 가속기(H/B 시리즈 GPU), 게이밍 GPU(GeForce), 프로페셔널 비주얼라이제이션, 자율주행(DRIVE) 등 네 가지 주요 부문을 운영합니다.",
    keyProducts: [
      "데이터센터 GPU (Hopper / Blackwell)",
      "GeForce 게이밍 GPU",
      "Professional Visualization",
      "Automotive (DRIVE)",
      "CUDA·소프트웨어 스택",
    ],
    keyMarkets: ["미국", "중국", "유럽", "아시아"],
    revenueStructure: [
      { name: "Data Center", share: "약 87%" },
      { name: "Gaming", share: "약 9%" },
      { name: "Professional Visualization", share: "약 2%" },
      { name: "Automotive·기타", share: "약 2%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-05-19",
        summary: "최근 분기 매출·세그먼트별 실적, 데이터센터 부문 성장에 대한 분기 보고서가 제출되었습니다.",
        checkpoints: ["Data Center 매출 성장률", "공급 현황 및 백로그", "지역별 매출 비중"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "차세대 AI 가속기 양산 일정 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-18",
        summary: "차세대 AI 가속기 양산 일정과 주요 고객사 동향에 대한 시장 코멘트입니다.",
        keywords: ["AI GPU", "양산", "고객사"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "수출 규제 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-09",
        summary: "특정 지역에 대한 AI 반도체 수출 규제와 관련된 보도 내용을 정리했습니다.",
        keywords: ["수출 규제", "지정학", "AI 반도체"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $40.2B",
      operatingProfit: "약 $24.5B",
      netProfit: "약 $20.8B",
      yoyRevenue: "+125.4%",
      yoyOperatingProfit: "+186.1%",
      checkpoints: [
        "데이터센터 매출 성장 지속성",
        "공급 확대와 백로그 해소 속도",
        "수출 규제 영향",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+125.4%" },
      { label: "영업이익률", value: "약 60.9%" },
      { label: "부채비율", value: "약 40%" },
      { label: "영업현금흐름", value: "매우 양호 (목업)" },
      { label: "P/E", value: "62.1배", isReference: true, note: "참고 지표" },
      { label: "P/B", value: "38.2배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["10-Q 상 데이터센터 세부 매출", "공급 계약 관련 공시"],
      earnings: ["데이터센터 성장률", "공급/백로그 흐름"],
      news: ["수출 규제 변화", "경쟁사 신제품 동향"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Tesla",
    symbol: "TSLA",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Consumer Discretionary",
    industry: "Auto Manufacturers",
    description:
      "전기차, 에너지 저장 시스템, 자율주행 소프트웨어를 운영하는 전기차·에너지 기업",
    businessSummary:
      "Tesla는 모델 S/3/X/Y 및 사이버트럭 등 전기차, 에너지 저장 시스템(Megapack/Powerwall), 태양광, FSD(완전 자율주행) 소프트웨어를 운영합니다.",
    keyProducts: [
      "Model 3 / Model Y",
      "Model S / Model X",
      "Cybertruck",
      "Energy Storage (Megapack/Powerwall)",
      "FSD 소프트웨어",
    ],
    keyMarkets: ["미국", "중국", "유럽"],
    revenueStructure: [
      { name: "Automotive", share: "약 82%" },
      { name: "Energy Generation & Storage", share: "약 9%" },
      { name: "Services & Other", share: "약 9%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-04-26",
        summary: "분기 매출, 차량 인도 대수, 자동차 부문 이익률 등이 포함된 분기 보고서가 제출되었습니다.",
        checkpoints: ["차량 인도 대수", "자동차 부문 매출총이익률", "에너지 부문 매출 성장"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "신모델·가격 정책 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary: "신모델 출시 일정과 가격 정책 변화에 대한 시장 코멘트입니다.",
        keywords: ["신모델", "가격 인하", "수요"],
        sourceUrl: "#",
      },
      {
        id: "n2",
        title: "FSD·로보택시 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-10",
        summary: "FSD 업데이트 및 로보택시 로드맵 관련 보도 내용을 정리했습니다.",
        keywords: ["FSD", "로보택시", "자율주행"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $22.5B",
      operatingProfit: "약 $1.4B",
      netProfit: "약 $1.1B",
      yoyRevenue: "-3.8%",
      yoyOperatingProfit: "-42.5%",
      checkpoints: [
        "차량 인도 대수와 ASP 변화",
        "자동차 매출총이익률 흐름",
        "FSD·에너지 부문 성장",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "-3.8%" },
      { label: "영업이익률", value: "약 6.2%" },
      { label: "부채비율", value: "약 80%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "P/E", value: "72.4배", isReference: true, note: "참고 지표" },
      { label: "P/B", value: "10.8배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["인도 대수·이익률 관련 분기 보고", "신규 모델 관련 공시"],
      earnings: ["자동차 매출총이익률", "에너지 부문 매출 성장"],
      news: ["FSD·로보택시 진행 상황", "주요 시장 수요"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Palantir",
    symbol: "PLTR",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software · Data Analytics",
    description:
      "정부·기업 대상 데이터 통합·AI 운영 플랫폼(Foundry, Gotham, AIP)을 제공하는 소프트웨어 기업",
    businessSummary:
      "Palantir는 정부 부문(Gotham), 기업 부문(Foundry), AI 운영 플랫폼(AIP)을 제공하는 데이터·AI 소프트웨어 기업입니다.",
    keyProducts: ["Palantir Gotham", "Palantir Foundry", "Palantir Apollo", "AIP (AI Platform)"],
    keyMarkets: ["미국 정부", "글로벌 기업", "동맹국 정부"],
    revenueStructure: [
      { name: "Government", share: "약 54%" },
      { name: "Commercial", share: "약 46%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-05-06",
        summary: "분기 매출, 정부·기업 부문별 성장, 신규 계약 관련 정보가 포함된 분기 보고서가 제출되었습니다.",
        checkpoints: ["AIP 도입 고객 수 증가", "정부·기업 부문 성장률", "잔여 계약 잔액"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "AIP 도입 사례 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-14",
        summary: "주요 기업의 AIP 도입 사례 및 활용 영역과 관련된 보도 내용을 정리했습니다.",
        keywords: ["AIP", "도입 사례", "기업"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $720M",
      operatingProfit: "약 $90M",
      netProfit: "약 $80M",
      yoyRevenue: "+22.5%",
      yoyOperatingProfit: "+45.2%",
      checkpoints: [
        "기업(Commercial) 부문 성장 지속성",
        "AIP 도입 고객 수",
        "정부 부문 신규 계약",
      ],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+22.5%" },
      { label: "영업이익률", value: "약 12.5%" },
      { label: "부채비율", value: "약 25%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "P/E", value: "210배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "32배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["10-Q 상의 정부·기업 부문 성장률", "주요 계약 관련 공시"],
      earnings: ["기업 부문 성장", "AIP 도입 속도"],
      news: ["AIP 도입 사례", "정부 계약 동향"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  // =============== 추가 한국 종목 (1단계 마무리 데모) ===============
  {
    name: "SK하이닉스",
    symbol: "000660",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "IT",
    industry: "반도체",
    description: "DRAM·NAND·HBM 메모리 반도체에 집중하는 글로벌 메모리 전문 기업",
    businessSummary:
      "SK하이닉스는 DRAM, NAND Flash, HBM(고대역폭메모리) 등 메모리 반도체를 중심으로 데이터센터·모바일·PC 시장을 공급하는 메모리 전문 반도체 기업입니다.",
    keyProducts: ["DRAM", "NAND Flash", "HBM (HBM3·HBM3E)", "eSSD", "이미지센서"],
    keyMarkets: ["한국", "미국", "중국", "유럽"],
    revenueStructure: [
      { name: "DRAM", share: "약 55%" },
      { name: "NAND", share: "약 30%" },
      { name: "HBM·기타", share: "약 15%", note: "AI 서버 비중 확대 흐름" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-08",
        summary:
          "분기 매출, 사업부문별 실적, 메모리 가격 추세에 대한 분기보고서가 제출되었습니다.",
        checkpoints: ["DRAM·NAND 가격 회복 속도", "HBM 매출 비중", "CAPEX 가이드라인"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "HBM 공급 관련 코멘트",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary: "HBM3E 공급 계약과 양산 일정 관련 시장 코멘트입니다.",
        keywords: ["HBM", "AI 서버", "공급 계약"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 12.5조 원",
      operatingProfit: "약 2.9조 원",
      netProfit: "약 2.1조 원",
      yoyRevenue: "+42.1%",
      yoyOperatingProfit: "흑자 전환",
      checkpoints: ["HBM 비중 확대 속도", "메모리 일반 가격 회복", "CAPEX 부담"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+42.1%" },
      { label: "영업이익률", value: "약 23.2%" },
      { label: "부채비율", value: "약 70%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "9.1배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "1.8배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["분기보고서 부문별 매출 추세", "CAPEX·설비 투자 공시"],
      earnings: ["HBM 매출 비중", "메모리 일반 가격 회복 속도"],
      news: ["AI 서버 수요 흐름", "수출 규제 변화"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "기아",
    symbol: "000270",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "경기소비재",
    industry: "자동차",
    description: "내연기관·하이브리드·전기차를 아우르는 글로벌 완성차 제조 기업",
    businessSummary:
      "기아는 현대차그룹 산하의 글로벌 완성차 기업으로 내연기관·하이브리드·전기차(EV) 라인업을 운영하며 북미·유럽·신흥국 시장에 차량을 공급합니다.",
    keyProducts: ["SUV(쏘렌토·텔루라이드)", "EV(EV6·EV9)", "PBV", "상용차"],
    keyMarkets: ["한국", "북미", "유럽", "인도"],
    revenueStructure: [
      { name: "북미", share: "약 36%" },
      { name: "한국 내수", share: "약 22%" },
      { name: "유럽", share: "약 18%" },
      { name: "신흥국", share: "약 20%" },
      { name: "기타", share: "약 4%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-09",
        summary:
          "분기 매출, 지역별 판매대수, 영업이익률이 포함된 분기보고서가 제출되었습니다.",
        checkpoints: ["북미 인센티브 흐름", "전기차 비중과 마진", "환율 영향"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "북미 SUV 판매 흐름",
        press: "정보 제공용 목업 매체",
        date: "2026-05-14",
        summary: "북미 시장 SUV 판매 추세와 인센티브 관련 보도입니다.",
        keywords: ["북미", "SUV", "인센티브"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 25조 원",
      operatingProfit: "약 2.7조 원",
      netProfit: "약 2.2조 원",
      yoyRevenue: "+5.4%",
      yoyOperatingProfit: "+3.8%",
      checkpoints: ["고부가 차종 ASP", "전기차 수익성", "환율"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+5.4%" },
      { label: "영업이익률", value: "약 10.8%" },
      { label: "부채비율", value: "약 105%", note: "금융 부문 포함" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "4.8배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "0.9배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["주주환원 정책 변화", "지역별 판매 공시"],
      earnings: ["고부가 차종 비중", "전기차 수익성"],
      news: ["미국 관세 정책", "원/달러 환율"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "셀트리온",
    symbol: "068270",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "헬스케어",
    industry: "바이오시밀러·제약",
    description: "바이오시밀러를 중심으로 한 글로벌 바이오·제약 기업",
    businessSummary:
      "셀트리온은 자가면역·항암·당뇨 분야의 바이오시밀러를 개발·생산하는 바이오 기업으로, 셀트리온헬스케어와 통합 후 글로벌 마케팅을 직접 수행합니다.",
    keyProducts: ["램시마(인플릭시맙)", "트룩시마(리툭시맙)", "허쥬마(트라스투주맙)", "유플라이마(아달리무맙)"],
    keyMarkets: ["유럽", "미국", "한국", "신흥국"],
    revenueStructure: [
      { name: "바이오시밀러", share: "약 78%" },
      { name: "케미컬·기타", share: "약 22%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-10",
        summary: "분기 매출, 제품별 매출 비중이 포함된 분기보고서가 제출되었습니다.",
        checkpoints: ["미국 시장 점유율", "신제품 출시 일정", "환율 영향"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "미국 시장 진입 일정 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-12",
        summary: "신규 바이오시밀러의 미국 FDA 승인 일정 관련 보도입니다.",
        keywords: ["FDA", "바이오시밀러", "미국"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 8,500억 원",
      operatingProfit: "약 1,800억 원",
      netProfit: "약 1,400억 원",
      yoyRevenue: "+18.2%",
      yoyOperatingProfit: "+22.6%",
      checkpoints: ["신제품 매출 비중", "미국 시장 점유율", "환율"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+18.2%" },
      { label: "영업이익률", value: "약 21.2%" },
      { label: "부채비율", value: "약 45%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "36.5배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "3.1배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["신제품 임상·승인 공시", "M&A·자회사 합병 공시"],
      earnings: ["미국 매출 비중", "신제품 매출 기여"],
      news: ["FDA 승인 일정", "경쟁사 가격 정책"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "한화에어로스페이스",
    symbol: "012450",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "산업재",
    industry: "방산·항공우주",
    description: "K9 자주포·천무 등 방산과 항공기 엔진을 운영하는 방산·항공우주 기업",
    businessSummary:
      "한화에어로스페이스는 K9 자주포, 천무 다연장로켓 등 방산 사업과 항공기 엔진, 위성·우주 발사체 사업을 영위하는 한화그룹의 방산·항공우주 핵심 계열사입니다.",
    keyProducts: ["K9 자주포", "천무", "장갑차", "항공기 엔진", "위성·발사체"],
    keyMarkets: ["한국", "유럽(폴란드)", "중동", "동남아"],
    revenueStructure: [
      { name: "방산(지상)", share: "약 60%" },
      { name: "항공·엔진", share: "약 25%" },
      { name: "우주·기타", share: "약 15%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "주요사항보고서(단일판매·공급계약체결)",
        date: "2026-05-13",
        summary: "해외 정부 대상 대형 방산 공급계약 체결 관련 공시입니다.",
        checkpoints: ["계약 금액과 납기", "환율 조건", "지급 조건"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "유럽 방산 수주 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-16",
        summary: "유럽 주요국 방산 수주 흐름 관련 코멘트입니다.",
        keywords: ["방산 수주", "유럽", "K9"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 2.8조 원",
      operatingProfit: "약 3,400억 원",
      netProfit: "약 2,500억 원",
      yoyRevenue: "+34.5%",
      yoyOperatingProfit: "+121.3%",
      checkpoints: ["방산 잔고", "환율 영향", "납기 일정"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+34.5%" },
      { label: "영업이익률", value: "약 12.1%" },
      { label: "부채비율", value: "약 180%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "PER", value: "22.4배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "3.5배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["대형 공급계약 공시", "주주환원 정책"],
      earnings: ["수주 잔고", "환율"],
      news: ["글로벌 방산 수요", "지정학적 변수"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "두산에너빌리티",
    symbol: "034020",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "산업재",
    industry: "발전 설비·SMR",
    description: "원자력·가스터빈·수소 등 발전 설비를 운영하는 중공업 기업",
    businessSummary:
      "두산에너빌리티는 대형 원전 주기기, SMR(소형모듈원전), 가스터빈, 수소 사업 등 발전 설비를 공급하는 두산그룹의 중공업 핵심 계열사입니다.",
    keyProducts: ["원자력 주기기", "SMR", "가스터빈", "수소 발전"],
    keyMarkets: ["한국", "중동", "미국"],
    revenueStructure: [
      { name: "에너지(발전 설비)", share: "약 55%" },
      { name: "건설·기타", share: "약 30%" },
      { name: "신사업(SMR·수소)", share: "약 15%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "단일판매·공급계약체결",
        date: "2026-05-11",
        summary: "해외 원전 주기기 공급계약 체결 관련 공시입니다.",
        checkpoints: ["계약 규모", "납기 일정", "결제 통화"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "SMR 수주 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-13",
        summary: "북미·유럽 SMR 수주 관련 시장 코멘트입니다.",
        keywords: ["SMR", "원전", "수주"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 3.7조 원",
      operatingProfit: "약 2,300억 원",
      netProfit: "약 1,500억 원",
      yoyRevenue: "+8.6%",
      yoyOperatingProfit: "+11.2%",
      checkpoints: ["원전 수주 잔고", "SMR 사업 진척도", "운영 자본"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+8.6%" },
      { label: "영업이익률", value: "약 6.2%" },
      { label: "부채비율", value: "약 130%" },
      { label: "영업현금흐름", value: "보통 (목업)" },
      { label: "PER", value: "45.1배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "2.4배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["대형 공급계약 공시", "유상증자·자본 변동"],
      earnings: ["원전 수주 잔고", "SMR 매출 발생 시점"],
      news: ["국내외 원전 정책 변화", "SMR 인증 일정"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  {
    name: "LG에너지솔루션",
    symbol: "373220",
    market: "kr",
    country: "한국",
    exchange: "KRX",
    sector: "IT·소재",
    industry: "2차전지",
    description: "전기차·ESS용 리튬이온 배터리를 글로벌 공급하는 2차전지 전문 기업",
    businessSummary:
      "LG에너지솔루션은 전기차(EV) 배터리와 에너지저장장치(ESS) 배터리를 생산하는 글로벌 2차전지 기업으로 북미·유럽·아시아에 생산 거점을 운영합니다.",
    keyProducts: ["EV 배터리(파우치·원통형)", "ESS 배터리", "소형 배터리"],
    keyMarkets: ["북미", "유럽", "한국", "중국"],
    revenueStructure: [
      { name: "자동차전지", share: "약 78%" },
      { name: "소형·ESS 등", share: "약 22%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "분기보고서 제출",
        date: "2026-05-09",
        summary: "분기 매출, 지역별 생산 가동률, AMPC(미국 보조금) 영향 관련 분기보고서입니다.",
        checkpoints: ["AMPC 인식 규모", "북미 가동률", "원자재 가격 추세"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "북미 배터리 수요 흐름",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary: "북미 EV 시장 수요와 주요 OEM 동향 관련 보도입니다.",
        keywords: ["EV", "배터리", "AMPC"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "2026년 1분기 (목업)",
      revenue: "약 6.8조 원",
      operatingProfit: "약 3,500억 원",
      netProfit: "약 2,200억 원",
      yoyRevenue: "-3.2%",
      yoyOperatingProfit: "-18.5%",
      checkpoints: ["AMPC 보조금 인식", "북미 가동률", "리튬 가격"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "-3.2%" },
      { label: "영업이익률", value: "약 5.1%" },
      { label: "부채비율", value: "약 95%" },
      { label: "영업현금흐름", value: "보통 (목업)" },
      { label: "PER", value: "120배", isReference: true, note: "참고 지표" },
      { label: "PBR", value: "3.8배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["대형 OEM 공급계약 공시", "AMPC 관련 회계 처리"],
      earnings: ["북미 매출 비중", "원자재 가격 흐름"],
      news: ["EV 수요 사이클", "미국 정책 변화"],
    },
    sourceLinks: [
      { label: "DART 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 18:00 KST",
  },
  // =============== 추가 미국 종목 ===============
  {
    name: "Microsoft",
    symbol: "MSFT",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software · Cloud",
    description: "Azure 클라우드·M365·Windows·게임을 운영하는 종합 소프트웨어 기업",
    businessSummary:
      "Microsoft는 Azure 클라우드, Microsoft 365, Dynamics, GitHub, LinkedIn, Xbox 게임 등을 운영하며 OpenAI와의 파트너십을 통해 생성형 AI 기능을 제품 전반에 통합하고 있습니다.",
    keyProducts: ["Azure", "Microsoft 365", "Dynamics 365", "GitHub", "Xbox", "Copilot"],
    keyMarkets: ["미국", "유럽", "아시아"],
    revenueStructure: [
      { name: "Intelligent Cloud (Azure)", share: "약 43%" },
      { name: "Productivity (M365 외)", share: "약 33%" },
      { name: "More Personal Computing", share: "약 24%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-04-30",
        summary: "분기 매출, 세그먼트별 실적, Azure 성장률 관련 분기 보고서입니다.",
        checkpoints: ["Azure 성장률", "Copilot 매출 기여", "CAPEX"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "Copilot 도입 사례 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-17",
        summary: "기업용 Copilot 도입과 사용 시간 관련 시장 코멘트입니다.",
        keywords: ["AI", "Copilot", "Azure"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q3 (목업)",
      revenue: "약 $66.5B",
      operatingProfit: "약 $30.2B",
      netProfit: "약 $24.6B",
      yoyRevenue: "+13.8%",
      yoyOperatingProfit: "+15.4%",
      checkpoints: ["Azure 성장률", "Copilot 매출 기여", "CAPEX 부담"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+13.8%" },
      { label: "영업이익률", value: "약 45.4%" },
      { label: "부채비율", value: "약 70%" },
      { label: "영업현금흐름", value: "매우 양호 (목업)" },
      { label: "P/E", value: "35.6배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "12.8배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["10-Q 세그먼트 매출 흐름", "CAPEX 가이드라인"],
      earnings: ["Azure 성장률", "AI 매출 기여"],
      news: ["AI 경쟁 동향", "엔터프라이즈 IT 지출 흐름"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Alphabet",
    symbol: "GOOGL",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Communication Services",
    industry: "Internet · Advertising",
    description: "Google 검색·YouTube·광고·Google Cloud·Android·Waymo를 운영하는 인터넷 플랫폼 기업",
    businessSummary:
      "Alphabet은 Google 검색·YouTube 등 광고 사업, Google Cloud, Android, Waymo(자율주행), Verily(헬스케어) 등을 운영하는 미국 인터넷 플랫폼 지주회사입니다.",
    keyProducts: ["Google 검색", "YouTube", "Google Cloud", "Android", "Pixel", "Gemini"],
    keyMarkets: ["미국", "유럽", "아시아", "신흥국"],
    revenueStructure: [
      { name: "Google Services (광고)", share: "약 78%" },
      { name: "Google Cloud", share: "약 12%" },
      { name: "Other Bets·기타", share: "약 10%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-04-29",
        summary: "분기 매출, 광고·클라우드 성장률 관련 10-Q입니다.",
        checkpoints: ["검색 광고 성장률", "Cloud 영업이익률", "Gemini 통합 영향"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "Gemini 통합 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-16",
        summary: "검색·워크스페이스에 Gemini 통합 진척 관련 코멘트입니다.",
        keywords: ["Gemini", "검색", "AI"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $90.2B",
      operatingProfit: "약 $27.8B",
      netProfit: "약 $23.5B",
      yoyRevenue: "+12.1%",
      yoyOperatingProfit: "+18.0%",
      checkpoints: ["검색 광고 성장률", "Cloud 흑자 폭", "AI CAPEX"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+12.1%" },
      { label: "영업이익률", value: "약 30.8%" },
      { label: "부채비율", value: "약 22%" },
      { label: "영업현금흐름", value: "매우 양호 (목업)" },
      { label: "P/E", value: "26.3배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "6.4배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["광고·Cloud 부문 매출", "주식기반 보상 규모"],
      earnings: ["검색 광고 성장", "Cloud 수익성"],
      news: ["AI 검색 사용자 반응", "반독점 이슈"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Amazon",
    symbol: "AMZN",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Consumer Discretionary",
    industry: "E-commerce · Cloud",
    description: "Amazon 커머스·AWS·광고·Prime을 운영하는 글로벌 이커머스·클라우드 기업",
    businessSummary:
      "Amazon은 글로벌 이커머스, AWS 클라우드, 광고, Prime 구독, 디바이스 등 다양한 사업을 운영하며 매출 비중에서는 커머스가, 이익 비중에서는 AWS·광고가 핵심입니다.",
    keyProducts: ["Amazon.com", "AWS", "Prime", "Amazon Ads", "Alexa/Echo"],
    keyMarkets: ["북미", "유럽", "아시아"],
    revenueStructure: [
      { name: "Online + Physical Stores", share: "약 49%" },
      { name: "Third-party Seller Services", share: "약 24%" },
      { name: "AWS", share: "약 17%" },
      { name: "Advertising", share: "약 8%" },
      { name: "Subscription·Other", share: "약 2%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-04-30",
        summary: "분기 매출, AWS 매출 성장률, 광고 매출 관련 10-Q입니다.",
        checkpoints: ["AWS 매출 성장률", "광고 매출 성장률", "리테일 마진"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "AWS Re:Invent 관련 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary: "AWS 신규 서비스 발표와 고객 도입 사례 보도입니다.",
        keywords: ["AWS", "클라우드", "AI"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $147.8B",
      operatingProfit: "약 $15.3B",
      netProfit: "약 $11.2B",
      yoyRevenue: "+11.5%",
      yoyOperatingProfit: "+24.3%",
      checkpoints: ["AWS 매출 성장률", "리테일 마진 회복", "광고 매출 비중"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+11.5%" },
      { label: "영업이익률", value: "약 10.4%" },
      { label: "부채비율", value: "약 60%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "P/E", value: "44.1배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "3.2배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["AWS·광고 부문 매출", "CAPEX 가이드라인"],
      earnings: ["AWS 성장률", "리테일 마진"],
      news: ["AI 인프라 투자", "물류 자동화 진척"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "Meta",
    symbol: "META",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Communication Services",
    industry: "Social Media · Advertising",
    description: "Facebook·Instagram·WhatsApp·Reality Labs를 운영하는 글로벌 SNS·광고 기업",
    businessSummary:
      "Meta는 Facebook, Instagram, WhatsApp, Threads 등 SNS 광고 사업과 Reality Labs(VR/AR), Llama 등 AI 사업을 운영합니다.",
    keyProducts: ["Facebook", "Instagram", "WhatsApp", "Threads", "Quest VR", "Llama"],
    keyMarkets: ["미국", "유럽", "아시아"],
    revenueStructure: [
      { name: "Family of Apps (광고)", share: "약 97%" },
      { name: "Reality Labs", share: "약 3%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-04-29",
        summary: "분기 매출, 광고 단가, Reality Labs 손실 관련 10-Q입니다.",
        checkpoints: ["광고 ARPU", "Reality Labs 손실 규모", "AI CAPEX"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "Llama 모델 업데이트 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-14",
        summary: "신규 Llama 모델 공개와 사용 사례 관련 코멘트입니다.",
        keywords: ["Llama", "AI", "오픈소스"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $42.1B",
      operatingProfit: "약 $15.8B",
      netProfit: "약 $12.9B",
      yoyRevenue: "+17.2%",
      yoyOperatingProfit: "+28.6%",
      checkpoints: ["광고 ARPU", "Reality Labs 손실", "AI 인프라 CAPEX"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+17.2%" },
      { label: "영업이익률", value: "약 37.5%" },
      { label: "부채비율", value: "약 35%" },
      { label: "영업현금흐름", value: "매우 양호 (목업)" },
      { label: "P/E", value: "28.4배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "8.1배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["광고 ARPU 흐름", "AI CAPEX 가이드라인"],
      earnings: ["광고 매출 성장", "Reality Labs 손실"],
      news: ["AI 모델 공개 일정", "규제 환경 변화"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "AMD",
    symbol: "AMD",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    description: "Ryzen·EPYC CPU·Radeon GPU·Instinct AI 가속기를 운영하는 종합 반도체 기업",
    businessSummary:
      "AMD는 Ryzen 데스크톱·노트북 CPU, EPYC 서버 CPU, Radeon GPU, Instinct AI 가속기(MI300 시리즈) 등 종합 반도체 라인업을 운영합니다.",
    keyProducts: ["Ryzen", "EPYC", "Radeon", "Instinct MI300", "Embedded·반도체"],
    keyMarkets: ["미국", "중국", "유럽", "아시아"],
    revenueStructure: [
      { name: "Data Center", share: "약 50%" },
      { name: "Client (Ryzen)", share: "약 25%" },
      { name: "Gaming (Radeon, 콘솔)", share: "약 12%" },
      { name: "Embedded", share: "약 13%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-05-02",
        summary: "분기 매출, 세그먼트별 실적, MI300 출하 관련 10-Q입니다.",
        checkpoints: ["MI300 출하량", "데이터센터 매출 성장률", "재고 수준"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "MI300 양산 일정 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-15",
        summary: "MI300 시리즈 양산 일정과 고객사 동향 관련 코멘트입니다.",
        keywords: ["MI300", "AI 가속기", "데이터센터"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $7.2B",
      operatingProfit: "약 $1.0B",
      netProfit: "약 $0.8B",
      yoyRevenue: "+22.6%",
      yoyOperatingProfit: "+85.3%",
      checkpoints: ["MI300 매출 비중", "데이터센터 매출 성장", "Client 마진"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+22.6%" },
      { label: "영업이익률", value: "약 13.9%" },
      { label: "부채비율", value: "약 18%" },
      { label: "영업현금흐름", value: "양호 (목업)" },
      { label: "P/E", value: "48.2배", isReference: true, note: "참고 지표" },
      { label: "P/S", value: "8.5배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["대형 OEM 공급계약 공시", "재고·CAPEX 가이드"],
      earnings: ["MI300 매출", "데이터센터 성장률"],
      news: ["경쟁사(Nvidia) 신제품", "수출 규제 변화"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
  {
    name: "SoundHound AI",
    symbol: "SOUN",
    market: "us",
    country: "미국",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Voice AI · Software",
    description: "음성 AI 플랫폼과 자동차·QSR(외식) 도메인 솔루션을 운영하는 AI 소프트웨어 기업",
    businessSummary:
      "SoundHound AI는 음성 인식·이해 기술을 자동차·QSR·기업용 음성 어시스턴트 등에 공급하는 미국 AI 소프트웨어 기업입니다.",
    keyProducts: ["Houndify 음성 플랫폼", "자동차용 음성 어시스턴트", "QSR 드라이브스루 솔루션"],
    keyMarkets: ["미국", "유럽", "아시아"],
    revenueStructure: [
      { name: "Subscription·Royalty", share: "약 60%" },
      { name: "Service & License", share: "약 40%" },
    ],
    recentDisclosures: [
      {
        id: "d1",
        title: "10-Q (분기 보고서)",
        date: "2026-05-10",
        summary: "분기 매출, 신규 계약 잔액 관련 10-Q입니다.",
        checkpoints: ["계약 잔액(RPO) 증가", "QSR 도입 사례", "현금 소진율"],
        sourceUrl: "#",
      },
    ],
    recentNews: [
      {
        id: "n1",
        title: "QSR 체인 도입 보도",
        press: "정보 제공용 목업 매체",
        date: "2026-05-13",
        summary: "주요 QSR 체인의 음성 AI 드라이브스루 도입 사례 보도입니다.",
        keywords: ["음성 AI", "QSR", "드라이브스루"],
        sourceUrl: "#",
      },
    ],
    earningsSummary: {
      id: "e1",
      period: "FY26 Q1 (목업)",
      revenue: "약 $24M",
      operatingProfit: "약 -$8M",
      netProfit: "약 -$10M",
      yoyRevenue: "+82.4%",
      yoyOperatingProfit: "적자 폭 감소",
      checkpoints: ["RPO(계약 잔액)", "현금 소진율", "주식기반 보상"],
    },
    financialMetrics: [
      { label: "매출 성장률 (YoY)", value: "+82.4%" },
      { label: "영업이익률", value: "약 -33%" },
      { label: "부채비율", value: "약 50%" },
      { label: "영업현금흐름", value: "마이너스 (목업)" },
      { label: "P/S", value: "32.0배", isReference: true, note: "참고 지표" },
    ],
    checkpoints: {
      disclosure: ["증자·전환사채 공시", "주요 계약 공시"],
      earnings: ["매출 성장률", "현금 소진율"],
      news: ["AI 음성 시장 경쟁", "주요 도입 사례"],
    },
    sourceLinks: [
      { label: "SEC EDGAR 공시 원문", href: "#", category: "공시" },
      { label: "주요 언론 보도", href: "#", category: "뉴스" },
      { label: "분기 실적 발표 자료", href: "#", category: "실적" },
    ],
    lastUpdated: "2026-05-20 09:00 ET",
  },
];

void sharedDisclaimerCheckpoints;

export function isMarketCode(value: unknown): value is MarketCode {
  return value === "kr" || value === "us";
}

export function getStockBy(
  market: string | undefined,
  symbol: string | undefined,
): Stock | undefined {
  if (!market || !symbol) return undefined;
  if (!isMarketCode(market)) return undefined;
  const list = Array.isArray(mockStocks) ? mockStocks : [];
  return list.find(
    (s) =>
      s.market === market &&
      s.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}

export function searchStocks(query: string, market?: MarketCode | "all") {
  const q = (query ?? "").trim().toLowerCase();
  const list = Array.isArray(mockStocks) ? mockStocks : [];
  return list.filter((s) => {
    if (market && market !== "all" && s.market !== market) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.symbol.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );
  });
}

// =================================================================
// Demo price snapshot — 종목별 결정론적 데모 가격 정보
// 실제 시세 연동은 정식 서비스 단계에서 제공될 예정입니다.
// =================================================================
