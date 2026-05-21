import GuideLayout from "@/components/guides/GuideLayout";
import { findGuide } from "@/lib/guides";

const SLUG = "cb-rights-offering-checkpoints";

export function generateMetadata() {
  const g = findGuide(SLUG);
  return {
    title: `${g?.title ?? "유상증자·전환사채 공시 체크포인트"} | 스톡리포트 가이드`,
    description: g?.description,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        유상증자(rights offering)와 전환사채(CB, convertible bond) 공시는
        회사의 <strong>자금 조달</strong>과 관련된 자료입니다. 주가에 큰
        영향을 줄 수 있는 사안이라 자주 화제가 되지만, 실제 공시 본문에는
        구체적인 조건이 정리돼 있어 가장 안전한 정보원입니다.
      </p>

      <h2>유상증자 공시에서 확인할 항목</h2>
      <ul>
        <li>
          <strong>발행 방식</strong>: 주주배정, 일반공모, 제3자배정 중 무엇인지.
          기존 주주에게 신주인수권이 주어지는지 여부가 달라집니다.
        </li>
        <li>
          <strong>발행 규모와 발행가</strong>: 신주 수, 발행가, 할인율. 기존
          주식 수와 비교해 희석 효과를 가늠할 수 있습니다.
        </li>
        <li>
          <strong>자금 사용 계획</strong>: 시설 투자, 운영 자금, 채무 상환 등.
          용도가 구체적일수록 회사 의도가 분명합니다.
        </li>
        <li>
          <strong>일정</strong>: 청약일, 납입일, 신주 상장일 등.
        </li>
      </ul>

      <h2>전환사채(CB) 공시에서 확인할 항목</h2>
      <ul>
        <li>
          <strong>발행 규모</strong>와 <strong>표면 이자율 / 만기 이자율</strong>
        </li>
        <li>
          <strong>전환가액</strong>과 <strong>리픽싱(refixing) 조건</strong>:
          주가 하락 시 전환가가 어떻게 조정되는지가 희석 가능성을 좌우합니다.
        </li>
        <li>
          <strong>풋옵션·콜옵션</strong>: 회사가 다시 사올 수 있는 권리, 사채권자가
          조기 상환을 요구할 수 있는 권리.
        </li>
        <li>
          <strong>자금 사용 계획</strong>과 <strong>최대 발행 가능 주식 수</strong>
        </li>
      </ul>

      <h2>“희석”을 단정하지 않기</h2>
      <p>
        유상증자나 CB가 발행된다고 해서 모든 경우에 주가가 떨어지는 것은
        아닙니다. 자금 용도가 사업 확장에 명확히 연결되거나, 발행 규모가
        시가총액 대비 작거나, 기존 주주에게 동등한 권리가 주어지는 경우에는
        시장이 다르게 평가하기도 합니다. 공시 본문을 통해
        <strong> 어떤 조건인지</strong>를 먼저 확인하는 것이 가장 정확한
        출발점입니다.
      </p>

      <p>
        본 글은 정보 제공용 자료이며, 특정 종목의 매수·매도·보유를 권유하지
        않습니다. 투자 판단의 책임은 이용자 본인에게 있습니다.
      </p>
    </GuideLayout>
  );
}
