import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PlanProvider } from "@/components/plans/PlanProvider";

export const metadata: Metadata = {
  title: "스톡리포트 | 한국·미국 주식 공시·뉴스·실적 요약",
  description:
    "스톡리포트는 한국과 미국 주식의 공시, 뉴스, 실적 정보를 한눈에 정리하는 주식 정보 웹사이트입니다. 매수·매도 권유 없이 투자자가 직접 판단할 수 있는 정보를 제공합니다.",
  keywords: [
    "스톡리포트",
    "주식 공시",
    "주식 뉴스 요약",
    "실적 요약",
    "한국 주식",
    "미국 주식",
  ],
  // 정식 출시 전이므로 검색엔진 색인을 막습니다.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
        <PlanProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PlanProvider>
      </body>
    </html>
  );
}
