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
    description: "스톡리포트를 처음 사용해 보는 개인 투자자에게 적합합니다.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.free.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.free.dailyAiSummaries}회`,
      "최근 뉴스 요약",
      "최근 공시 요약",
      `관심종목 ${PLAN_LIMITS.free.watchlistMax}개`,
      "오늘의 브리핑",
    ],
    cta: "무료로 시작하기",
    ctaHref: "/signup",
  },
  {
    name: PLAN_LIMITS.basic.label,
    price: "9,900원",
    priceNote: "/ 월",
    description: "꾸준히 시장을 챙겨보는 개인 투자자에게 적합합니다.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.basic.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.basic.dailyAiSummaries}회`,
      "한국·미국 종목 통합 검색",
      "공시 요약 전체 보기",
      "뉴스 요약 전체 보기",
      "실적 요약 전체 보기",
      `관심종목 ${PLAN_LIMITS.basic.watchlistMax}개`,
      "오늘의 시장 브리핑 전체 보기",
    ],
    cta: "베이직 시작하기",
    ctaHref: "/signup?plan=basic",
    highlighted: true,
  },
  {
    name: PLAN_LIMITS.pro.label,
    price: "19,900원",
    priceNote: "/ 월",
    description:
      "더 많은 종목을 깊이 있게 추적하고 싶은 사용자에게 적합합니다.",
    features: [
      `하루 종목 리포트 조회 ${PLAN_LIMITS.pro.dailyReportViews}회`,
      `하루 AI 요약 ${PLAN_LIMITS.pro.dailyAiSummaries}회`,
      `관심종목 ${PLAN_LIMITS.pro.watchlistMax}개`,
      "관심종목 일일 브리핑",
      "공시 발생 알림",
      "실적 발표 요약",
      "종목 비교 기능",
      "PDF 리포트 저장",
    ],
    cta: "프로 시작하기",
    ctaHref: "/signup?plan=pro",
  },
];

const faqs = [
  {
    q: "요금제는 언제든 변경할 수 있나요?",
    a: "네. 계정 페이지에서 언제든 다른 요금제로 변경할 수 있으며, 변경된 한도는 다음 결제일부터 적용됩니다.",
  },
  {
    q: "스톡리포트는 투자 추천 서비스인가요?",
    a: "아니요. 스톡리포트는 공시·뉴스·실적 등을 정리해 보여주는 정보 제공 서비스이며, 특정 종목의 매수·매도·보유를 권유하지 않습니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "환불 및 해지 정책 페이지의 안내에 따라 처리되며, 결제일 기준 7일 이내에는 사용 내역이 없을 경우 전액 환불이 가능합니다.",
  },
  {
    q: "한국 주식과 미국 주식 모두 지원하나요?",
    a: "네. 한국 KOSPI·KOSDAQ 종목과 미국 NYSE·NASDAQ 종목을 통합 검색·조회할 수 있습니다.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="요금제"
        title="필요한 만큼 선택하세요"
        description="모든 요금제는 정보 제공을 목적으로 제공됩니다. 매수·매도 권유 없이 투자자가 직접 판단할 수 있는 정보를 제공합니다."
        align="center"
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <PricingCard key={p.name} plan={p} />
        ))}
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
