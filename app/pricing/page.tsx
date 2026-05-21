import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import PricingCard, {
  type PricingPlan,
} from "@/components/pricing/PricingCard";
import { PLAN_LIMITS } from "@/lib/planLimits";

const plans: PricingPlan[] = [
  {
    name: PLAN_LIMITS.free.label,
    price: "0원",
    description: "스톡리포트를 가볍게 체험해 보세요.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.free.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.free.dailyAiSummaries}회`,
      "최근 뉴스 일부 요약",
      "최근 공시 일부 요약",
      `관심종목 ${PLAN_LIMITS.free.watchlistMax}개까지`,
      "오늘의 브리핑 일부 보기",
    ],
    cta: "준비 중",
  },
  {
    name: PLAN_LIMITS.basic.label,
    price: "9,900원",
    priceNote: "/ 월",
    description: "꾸준히 시장을 챙겨보는 개인 투자자에게 적합한 요금제입니다.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.basic.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.basic.dailyAiSummaries}회`,
      "한국·미국 종목 검색",
      "공시 요약 전체 보기",
      "뉴스 요약 전체 보기",
      "실적 요약 전체 보기",
      `관심종목 ${PLAN_LIMITS.basic.watchlistMax}개까지`,
      "오늘의 시장 브리핑 전체 보기",
    ],
    cta: "준비 중",
    highlighted: true,
  },
  {
    name: PLAN_LIMITS.pro.label,
    price: "19,900원",
    priceNote: "/ 월",
    description:
      "더 많은 종목을 깊이 있게 추적하고 싶은 사용자를 위한 요금제입니다.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.pro.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.pro.dailyAiSummaries}회`,
      `관심종목 ${PLAN_LIMITS.pro.watchlistMax}개까지`,
      "관심종목 일일 브리핑 (예정)",
      "공시 발생 알림 (예정)",
      "실적 발표 요약 (예정)",
      "종목 비교 기능 (예정)",
      "PDF 리포트 저장 (예정)",
    ],
    cta: "준비 중",
  },
];

const faqs = [
  {
    q: "결제는 언제 시작되나요?",
    a: "현재는 회원가입과 관심종목 저장 기능까지 제공되며, 결제 기능은 이후 단계에서 제공될 예정입니다.",
  },
  {
    q: "스톡리포트는 투자 추천 서비스인가요?",
    a: "아니요. 스톡리포트는 공시·뉴스·실적 등을 정리해 보여주는 정보 제공 서비스이며, 특정 종목의 매수·매도·보유를 권유하지 않습니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "정식 결제 도입 시 별도의 환불 정책이 공지될 예정입니다.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="요금제"
        title="필요한 만큼 선택하세요"
        description="모든 요금제는 정보 제공을 목적으로 제공됩니다. 결제 기능은 이후 단계에서 제공될 예정입니다."
        align="center"
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <PricingCard key={p.name} plan={p} />
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-600">
        결제 기능은 이후 단계에서 제공될 예정입니다. 모든 사용자는 회원가입 시
        무료 요금제로 시작합니다.
      </div>

      <section className="mt-16">
        <h3 className="text-xl font-bold text-slate-900">자주 묻는 질문</h3>
        <div className="mt-4 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="card p-5">
              <p className="text-sm font-semibold text-slate-900">{f.q}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}
