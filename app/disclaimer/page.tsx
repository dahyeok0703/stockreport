import SectionTitle from "@/components/common/SectionTitle";

const sections = [
  {
    title: "정보 제공 목적",
    body: "스톡리포트는 공시·뉴스·실적자료 등을 정리해 보여주는 정보 제공 서비스입니다. 모든 콘텐츠는 정보 제공만을 목적으로 합니다.",
  },
  {
    title: "투자 권유 아님",
    body: "본 서비스는 특정 종목의 매수·매도·보유를 권유하지 않습니다. 또한 목표가, 수익률 예측, 포트폴리오 조언을 제공하지 않습니다.",
  },
  {
    title: "AI 요약의 한계",
    body: "AI를 활용한 자동 요약은 원문의 모든 맥락을 완벽히 반영하지 못할 수 있으며, 누락 또는 오해가 발생할 가능성이 존재합니다. 중요한 의사결정 전에는 반드시 원문을 확인해 주세요.",
  },
  {
    title: "원문 확인 필요",
    body: "공시·뉴스·실적자료 등 원문 출처를 함께 제공하므로, 자세한 내용은 원문을 직접 확인해 주세요. 요약과 원문 사이에 차이가 있을 경우 원문이 우선합니다.",
  },
  {
    title: "투자 책임은 사용자 본인",
    body: "투자 판단과 그 결과에 대한 책임은 모두 이용자 본인에게 있으며, 본 서비스 또는 운영자는 투자 손실에 대해 어떠한 책임도 지지 않습니다.",
  },
  {
    title: "데이터 지연 가능성",
    body: "공시·뉴스·실적 데이터는 수집·정리 과정에서 일정한 시간이 지연될 수 있습니다. 실시간 정보가 필요한 경우 거래소·언론사 등의 공식 채널을 함께 활용해 주세요.",
  },
  {
    title: "오류 가능성",
    body: "데이터 수집·정리 과정 또는 AI 요약 과정에서 오류가 발생할 수 있습니다. 오류를 발견할 경우 운영자에게 알려주시면 빠르게 검토하겠습니다.",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="투자 유의사항"
        title="이용 전 반드시 읽어 주세요"
        description="스톡리포트는 정보 제공 서비스로서, 투자 권유나 자문이 아님을 명확히 안내합니다."
      />

      <div className="mt-8 space-y-3">
        {sections.map((s, i) => (
          <div key={s.title} className="card p-6">
            <h3 className="flex items-start gap-2 text-base font-semibold text-slate-900">
              <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-500">
        본 페이지는 사전 공지 없이 변경될 수 있으며, 변경 시 변경 일자와 함께
        반영됩니다.
      </p>
    </div>
  );
}
