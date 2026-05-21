import Link from "next/link";
import { getBusinessInfo } from "@/lib/businessInfo";
import { brandConfig } from "@/lib/brand";
import PeixeLuaLogo from "@/components/brand/PeixeLuaLogo";

const footerSections = [
  {
    title: "서비스",
    links: [
      { href: "/search", label: "종목검색" },
      { href: "/compare", label: "종목 비교" },
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
    title: "정책 및 고객센터",
    links: [
      { href: "/disclaimer", label: "투자 유의사항" },
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/refund", label: "환불 및 해지 정책" },
    ],
  },
];

export default function Footer() {
  const biz = getBusinessInfo();
  const supportEmail = biz?.supportEmail ?? brandConfig.supportEmail;

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
                {brandConfig.serviceNameKo}
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              한국과 미국 주식의 공시, 뉴스, 실적 정보를 한눈에 정리하는 주식
              정보 웹사이트입니다. 매수·매도 권유 없이, 투자자가 직접 판단할
              수 있는 정보를 제공합니다.
            </p>

            <dl className="mt-4 grid grid-cols-1 gap-1 text-xs text-slate-500 sm:grid-cols-2">
              <Row label="운영사" value={brandConfig.companyNameKo} />
              <Row label="서비스명" value={brandConfig.serviceNameKo} />
            </dl>

            {supportEmail && (
              <p className="mt-3 text-xs text-slate-500">
                고객센터 ·{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-slate-700 hover:underline"
                >
                  {supportEmail}
                </a>
              </p>
            )}
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

        {biz && (
          <div className="section-divider mt-10 pt-6">
            <h4 className="text-sm font-semibold text-slate-900">
              사업자 정보
            </h4>
            <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-xs text-slate-600 sm:grid-cols-2">
              <Row label="상호" value={biz.legalName} />
              <Row label="대표자" value={biz.representative} />
              <Row label="사업자등록번호" value={biz.registrationNumber} />
              <Row label="통신판매업 신고번호" value={biz.mailOrderNumber} />
              <Row label="주소" value={biz.address} />
              <Row label="고객센터 전화" value={biz.supportPhone} />
            </dl>
          </div>
        )}

        <div className="section-divider mt-10 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <PeixeLuaLogo variant="full" size="small" tone="muted" />
            <span className="text-xs text-slate-400">
              {brandConfig.companyNameKo} · {brandConfig.companyNameEn}
            </span>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} {brandConfig.companyNameKo}.
            본 사이트의 모든 요약과 정보는 공시·뉴스·실적자료를 바탕으로 한
            정보 제공용 자료이며, 특정 종목의 매수·매도·보유를 권유하지
            않습니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게
            있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="min-w-[80px] text-slate-500">{label}</dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  );
}
