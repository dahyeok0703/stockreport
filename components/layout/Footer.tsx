import Link from "next/link";

const footerSections = [
  {
    title: "서비스",
    links: [
      { href: "/search", label: "종목검색" },
      { href: "/briefing", label: "오늘의 브리핑" },
      { href: "/watchlist", label: "관심종목" },
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
      { href: "#", label: "이용약관" },
      { href: "#", label: "개인정보처리방침" },
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
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              한국과 미국 주식의 공시, 뉴스, 실적 정보를 AI가 정리해주는
              정보 제공 서비스입니다. 본 서비스는 투자 권유를 하지 않으며,
              모든 투자 판단의 책임은 이용자 본인에게 있습니다.
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
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider mt-10 pt-6">
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} 스톡리포트. 본 사이트의 모든 요약과
            정보는 공시·뉴스·실적자료를 바탕으로 한 정보 제공용 자료이며,
            특정 종목의 매수·매도·보유를 권유하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
