import GuideLayout from "@/components/guides/GuideLayout";
import { findGuide } from "@/lib/guides";

const SLUG = "how-to-read-dart";

export function generateMetadata() {
  const g = findGuide(SLUG);
  return {
    title: `${g?.title ?? "DART 공시 보는 법"} | 스톡리포트 가이드`,
    description: g?.description,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        한국 상장 기업의 공시 원문은 금융감독원이 운영하는
        <strong> 전자공시시스템 DART (dart.fss.or.kr)</strong>에서 모두 무료로
        볼 수 있습니다. 처음 보면 양이 많아 어디부터 봐야 할지 막막하지만,
        몇 가지 흐름만 익히면 빠르게 핵심을 짚어낼 수 있습니다.
      </p>

      <h2>먼저 봐야 할 보고서</h2>
      <ul>
        <li>
          <strong>사업보고서</strong>: 연 1회. 회사 사업 전반과 연간 재무를
          가장 자세히 다룹니다.
        </li>
        <li>
          <strong>반기보고서·분기보고서</strong>: 반기·분기 단위 실적과 사업
          현황. 가장 자주 업데이트되는 자료입니다.
        </li>
        <li>
          <strong>주요사항보고서</strong>: 자기주식 취득/처분, 유상증자,
          전환사채, 합병/분할, 영업양수도 등 큰 의사결정이 담깁니다.
        </li>
      </ul>

      <h2>분기보고서에서 빠르게 짚을 곳</h2>
      <ol>
        <li>
          <strong>요약 재무정보</strong>: 매출, 영업이익, 당기순이익이 전기 대비
          어떻게 움직였는지 한눈에 볼 수 있습니다.
        </li>
        <li>
          <strong>사업의 내용</strong>: 부문별 매출 비중, 주요 제품·서비스,
          시장 동향 코멘트가 담깁니다.
        </li>
        <li>
          <strong>주요계약 및 연구개발활동</strong>: 큰 공급 계약, R&D 비용
          비중 등을 확인할 수 있습니다.
        </li>
        <li>
          <strong>주주에 관한 사항</strong>: 최대주주·자기주식 변동 흐름.
        </li>
      </ol>

      <h2>주요사항보고서에서 확인할 항목</h2>
      <p>
        주요사항보고서는 "큰 변화"를 알리는 자료이기 때문에 본문보다도
        <strong> 첨부 문서</strong>를 함께 봐야 합니다. 자기주식 취득의 경우
        취득 규모·기간·목적이, 유상증자의 경우 발행가·할인율·자금 사용 계획이
        본문이나 첨부에 명시되어 있습니다.
      </p>

      <p>
        한 번에 모든 자료를 읽기보다, 본인이 관심 있는 종목 1~2개에 대해
        분기보고서 한 편을 천천히 읽어보면 다음부터는 훨씬 빨리 핵심에
        도달할 수 있습니다.
      </p>
    </GuideLayout>
  );
}
