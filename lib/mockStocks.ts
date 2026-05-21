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
