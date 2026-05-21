import GuideLayout from "@/components/guides/GuideLayout";
import { findGuide } from "@/lib/guides";

const SLUG = "what-is-disclosure";

export function generateMetadata() {
  const g = findGuide(SLUG);
  return {
    title: `${g?.title ?? "주식 공시란?"} | 스톡리포트 가이드`,
    description: g?.description,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        주식 <strong>공시</strong>는 상장 기업이 투자자에게 알릴 의무가 있는
        정보를 공식적으로 발표하는 절차입니다. 한국에서는 금융감독원이
        운영하는 전자공시시스템(DART)에, 미국에서는 SEC EDGAR에 자료가
        제출되고, 모두 일반 투자자가 무료로 열람할 수 있습니다.
      </p>

      <h2>왜 공시를 봐야 할까요?</h2>
      <p>
        뉴스 기사와 시장 분석은 공시를 한 번 해석한 결과물입니다. 같은 공시를
        두고 매체별로 다르게 해석할 수 있고, 시간이 지나며 강조점이 달라지기도
        합니다. 공시는 그 해석의 <strong>원본</strong>이기 때문에, 한 번
        직접 읽어보는 습관을 들이면 정보의 정확도와 시점 감각이 크게
        올라갑니다.
      </p>

      <h2>대표적인 공시 종류</h2>
      <ul>
        <li>
          <strong>사업·반기·분기 보고서</strong>: 회사의 사업·재무 상태를
          정기적으로 보고합니다.
        </li>
        <li>
          <strong>주요사항보고서</strong>: 유상증자, 전환사채 발행, 자기주식
          취득/처분, 합병/분할 등 굵직한 의사결정을 알립니다.
        </li>
        <li>
          <strong>임시공시·수시공시</strong>: 단일판매·공급계약, 자산 양수도,
          소송 등 즉시 알려야 하는 사안을 보고합니다.
        </li>
        <li>
          <strong>(미국) 10-K / 10-Q / 8-K</strong>: 연간/분기 보고서와
          현재 보고서. 8-K는 한국의 주요사항·수시공시에 가까운 역할을 합니다.
        </li>
      </ul>

      <h2>공시를 볼 때 확인할 항목</h2>
      <ol>
        <li>제목과 보고기간(언제 자료인지)</li>
        <li>구체 금액·수량·기간</li>
        <li>회사가 직접 강조한 핵심 변화</li>
        <li>여러 공시 간 일관성과 추세</li>
      </ol>

      <p>
        공시를 본다고 해서 곧바로 매매 판단을 내릴 필요는 없습니다. 오히려
        공시는 "지금 이 회사에 무슨 일이 있었는가"를 파악하기 위한
        <strong> 정보 제공용 자료</strong>로 사용하는 것이 안전합니다.
      </p>
    </GuideLayout>
  );
}
