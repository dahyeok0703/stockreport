import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";

export const metadata = {
  title: "환불 및 해지 정책 | 스톡리포트",
  robots: { index: false, follow: false },
};

export default function RefundPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="환불 및 해지 정책"
        title="환불 및 해지 정책"
        description="스톡리포트(이하 '회사')의 유료 요금제 결제·해지·환불에 관한 안내입니다."
      />

      <article className="prose mt-8 max-w-3xl">
        <h2>1. 유료 요금제 결제</h2>
        <p>
          유료 요금제는 월 단위 정기 결제로 운영되며, 결제일로부터 한 달 단위로
          자동 갱신됩니다. 이용자는 계정 페이지에서 언제든 다음 결제일을
          확인하고 정기 결제를 해지할 수 있습니다.
        </p>

        <h2>2. 해지 시점 및 잔여 이용 기간</h2>
        <p>
          정기 결제를 해지한 경우, 이미 결제된 이용 기간(해지 시점이 속한
          결제 주기) 동안에는 서비스를 그대로 이용할 수 있으며, 다음 결제일부터
          요금이 부과되지 않습니다.
        </p>

        <h2>3. 환불 가능 조건</h2>
        <ul>
          <li>
            결제일 기준 <strong>7일 이내</strong>이고 해당 결제 주기 내에
            서비스 사용 이력이 <strong>없는 경우</strong>: 전액 환불
          </li>
          <li>
            결제일 기준 7일 이내이고 일부 서비스 이용 이력이 있는 경우:
            이용 일수에 해당하는 금액과 위약금을 제외한 잔액 환불
          </li>
          <li>결제일 기준 7일 경과 후: 잔여 이용 기간에 대한 환불은 제공하지 않음</li>
        </ul>

        <h2>4. 환불 불가 사유</h2>
        <ul>
          <li>이용자가 본 정책 및 이용약관을 위반해 회사가 계약을 해지한 경우</li>
          <li>이미 사용한 기능에 대한 부분 환불</li>
          <li>이용자의 단순 변심에 의한 결제 후 7일 경과 시</li>
        </ul>

        <h2>5. 환불 신청 방법</h2>
        <p>
          환불을 원하시는 경우 계정 페이지의 결제 내역에서 환불을 요청하거나
          고객센터 이메일로 연락해 주세요. 환불은 결제 수단별 정책에 따라
          영업일 기준 3~7일 이내에 처리됩니다.
        </p>

        <h2>6. 결제 수단별 안내</h2>
        <p>
          신용카드 결제의 경우 결제 취소 형태로 처리되며, 결제 취소가 불가한
          경우 계좌 이체 등의 방식으로 환불이 진행될 수 있습니다.
        </p>

        <h2>7. 정책 변경</h2>
        <p>
          본 정책은 관련 법령과 회사 정책의 변경에 따라 개정될 수 있으며,
          개정 시 적용 일자와 함께 서비스 화면에 공지합니다.
        </p>
      </article>

      <div className="mt-12 max-w-3xl">
        <DisclaimerBox />
      </div>
    </div>
  );
}
