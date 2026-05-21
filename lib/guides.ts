/**
 * 가이드 콘텐츠 메타 데이터. 본문은 각 페이지 안에 직접 작성되어 있고,
 * 이 파일은 목차/카드 표시용 요약과 라우팅 정보를 한 곳에서 관리합니다.
 */

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  category: "공시" | "실적" | "재무";
  readMinutes: number;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "what-is-disclosure",
    title: "주식 공시란?",
    description:
      "공시가 무엇이고 왜 투자자에게 중요한지, 어떤 항목을 확인해야 하는지 정리했습니다.",
    category: "공시",
    readMinutes: 4,
  },
  {
    slug: "how-to-read-dart",
    title: "DART 공시 보는 법",
    description:
      "한국 전자공시시스템(DART)의 분기보고서·사업보고서·주요사항보고서 구조와 확인 포인트를 살펴봅니다.",
    category: "공시",
    readMinutes: 5,
  },
  {
    slug: "how-to-read-sec",
    title: "SEC 공시 보는 법",
    description:
      "미국 SEC EDGAR의 10-K, 10-Q, 8-K, 4, S-1, DEF 14A 등 주요 form을 어떤 순서로 읽으면 좋은지 안내합니다.",
    category: "공시",
    readMinutes: 5,
  },
  {
    slug: "how-to-read-earnings",
    title: "실적 발표 보는 법",
    description:
      "매출·영업이익·순이익·현금흐름의 기본 흐름과 전년 동기·전분기 비교 시 주의할 점을 정리했습니다.",
    category: "실적",
    readMinutes: 5,
  },
  {
    slug: "cb-rights-offering-checkpoints",
    title: "유상증자와 전환사채 공시에서 확인할 항목",
    description:
      "유상증자(rights offering)와 전환사채(CB) 공시에서 자주 나오는 항목과, 원문에서 반드시 확인해야 할 포인트를 정리했습니다.",
    category: "재무",
    readMinutes: 6,
  },
];

export function findGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
