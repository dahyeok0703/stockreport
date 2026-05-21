import GuideLayout from "@/components/guides/GuideLayout";
import { findGuide } from "@/lib/guides";

const SLUG = "how-to-read-earnings";

export function generateMetadata() {
  const g = findGuide(SLUG);
  return {
    title: `${g?.title ?? "실적 발표 보는 법"} | 스톡리포트 가이드`,
    description: g?.description,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        실적 발표는 회사가 한 분기 또는 한 해 동안 어떤 사업 성과를 냈는지
        숫자로 보여주는 자료입니다. 매체의 헤드라인보다, 원문에 적힌 숫자와
        주석을 함께 보는 것이 정확도를 높이는 가장 빠른 방법입니다.
      </p>

      <h2>가장 먼저 보는 4가지</h2>
      <ol>
        <li>
          <strong>매출</strong> — 회사가 한 기간 동안 벌어들인 금액. 핵심
          사업의 규모를 가늠합니다.
        </li>
        <li>
          <strong>영업이익</strong> — 본업으로 벌어들인 이익. 일회성 항목을
          빼고 회사의 평소 수익성을 보여줍니다.
        </li>
        <li>
          <strong>순이익</strong> — 세금까지 모두 반영된 최종 이익. 한 번에
          크게 움직일 수 있어 단독으로 보는 것은 위험합니다.
        </li>
        <li>
          <strong>영업현금흐름</strong> — 실제 현금 유입. 회계 이익과 차이가
          크면 그 이유를 함께 봐야 합니다.
        </li>
      </ol>

      <h2>비교는 같은 기준으로</h2>
      <p>
        실적은 <strong>전년 동기 대비(YoY)</strong>와
        <strong> 전분기 대비(QoQ)</strong>로 자주 비교합니다. YoY는 계절성을
        보정해주는 장점이 있고, QoQ는 최근 흐름의 변화를 빠르게 보여줍니다.
        단일 분기의 변동만 보고 추세를 단정하지 않는 것이 좋습니다.
      </p>

      <h2>주석과 회사 코멘트가 더 중요할 때</h2>
      <p>
        같은 매출 +10%라도 한 회사는 신제품 효과, 다른 회사는 환율 효과가
        주된 원인일 수 있습니다. 회사가 컨퍼런스콜이나 보도자료에서 어떤
        부분을 <strong>스스로 설명하는지</strong>를 함께 읽어야 숫자의
        의미가 잡힙니다. 단, 회사의 설명은 자기 평가이기 때문에 그대로
        받아들이기보다 함께 참고하는 정도가 안전합니다.
      </p>

      <p>
        실적을 본 결과를 곧바로 매매 판단으로 연결하지 않아도 됩니다. 실적은
        "이 회사가 지금 어떤 상태인가"를 가늠하는
        <strong> 정보 제공용 자료</strong>로 사용할 때 가장 안정적입니다.
      </p>
    </GuideLayout>
  );
}
