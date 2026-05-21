import GuideLayout from "@/components/guides/GuideLayout";
import { findGuide } from "@/lib/guides";

const SLUG = "how-to-read-sec";

export function generateMetadata() {
  const g = findGuide(SLUG);
  return {
    title: `${g?.title ?? "SEC 공시 보는 법"} | 스톡리포트 가이드`,
    description: g?.description,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        미국 상장 기업의 공시 원문은 <strong>SEC EDGAR (sec.gov/edgar)</strong>
        에서 무료로 볼 수 있습니다. 형식은 한국 DART와 다르지만 큰 흐름은
        비슷합니다. 자주 보게 되는 양식 몇 가지를 먼저 익히면 도움이 됩니다.
      </p>

      <h2>자주 보게 되는 SEC 양식</h2>
      <ul>
        <li>
          <strong>10-K</strong>: 연간 보고서. 사업·리스크 요인·재무가 가장
          상세히 들어 있습니다. 분량이 길어 목차를 활용하는 것이 좋습니다.
        </li>
        <li>
          <strong>10-Q</strong>: 분기 보고서. 세그먼트별 매출 흐름과 재무
          하이라이트를 비교적 가볍게 볼 수 있습니다.
        </li>
        <li>
          <strong>8-K</strong>: 중요 사건 보고. 한국의 주요사항·수시공시에
          해당합니다. 인수합병, 임원 변동, 결과 사전 발표 등이 담깁니다.
        </li>
        <li>
          <strong>4</strong>: 내부자 거래 보고. 임원·5% 이상 지분 보유자의
          매매 내역.
        </li>
        <li>
          <strong>S-1 / S-3</strong>: 신주 발행 등록 신고서.
        </li>
        <li>
          <strong>DEF 14A</strong>: 위임장 권유 서류. 주주총회 의안과 임원
          보상 정책을 확인할 수 있습니다.
        </li>
      </ul>

      <h2>10-Q에서 빠르게 짚을 곳</h2>
      <ol>
        <li>
          <strong>Item 2 — MD&A</strong>: 경영진의 사업 코멘트. 회사가 어떤
          변화를 강조하는지 가장 빠르게 알 수 있습니다.
        </li>
        <li>
          <strong>Segment 정보</strong>: 사업부문별 매출·이익이 어떻게
          움직였는지 표로 정리됩니다.
        </li>
        <li>
          <strong>Cash Flow</strong>: 회계 이익만 보지 말고 영업현금흐름까지
          함께 보면 회사의 현금 창출 능력을 가늠하기 쉽습니다.
        </li>
      </ol>

      <h2>EDGAR 검색 팁</h2>
      <p>
        회사 이름이 아니라 <strong>티커</strong> 또는
        <strong> CIK 번호</strong>로 검색하면 빠릅니다. CIK는 10자리 숫자로,
        한 번 알아두면 회사별 모든 공시를 한 화면에서 시간순으로 볼 수
        있습니다.
      </p>
    </GuideLayout>
  );
}
