import Link from "next/link";

const footerSections = [
  {
    title: "서비스",
    links: [
      { href: "/search", label: "종목검색" },
      { href: "/briefing", label: "오늘의 브리핑" },
      { href: "/calendar", label: "캘린더" },
      { href: "/watchlist", label: "관심종목" },
      { href: "/guides", label: "가이드" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/about", label: "서비스 소개" },
      { href: "/pricing", label: "요금제" },
    ],
  },
  {
    title: "정책",
    links: [
      { href: "/disclaimer", label: "투자 유의사항" },
      { href: "#", label: "이용약관 (준비 중)" },
      { href: "#", label: "개인정보처리방침 (준비 중)" },
      { href: "#", label: "환불 및 해지 정책 (준비 중)" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
                S
              </span>
              <span className="text-base font-bold text-slate-900">
                스톡리포트
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                DEMO
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              한국과 미국 주식의 공시, 뉴스, 실적 정보를 한눈에 정리하는 주식
              정보 웹사이트입니다. 매수·매도 권유 없이, 투자자가 직접 판단할
              수 있는 정보를 제공합니다.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-slate-900">
                {section.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <span className="text-sm text-slate-400">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider mt-10 pt-6">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
            현재 데모 데이터로 표시 중입니다.
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            스톡리포트는 정식 출시 전 데모 서비스입니다. 현재 표시되는 데이터는
            데모 데이터이며, 사업자 정보와 통신판매업 신고번호는 정식 서비스
            출시 시 고지됩니다.
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} 스톡리포트. 본 사이트의 모든 요약과
            정보는 공시·뉴스·실적자료를 바탕으로 한 정보 제공용 자료이며,
            특정 종목의 매수·매도·보유를 권유하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
