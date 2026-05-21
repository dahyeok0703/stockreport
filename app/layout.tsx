import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "스톡리포트 | 공시·뉴스·실적 정보 요약",
  description:
    "한국과 미국 주식의 공시, 뉴스, 실적 정보를 한눈에 정리해주는 정보 제공 서비스. 매수·매도 권유 없이 중립적으로 정리합니다.",
  keywords: [
    "스톡리포트",
    "주식 공시",
    "주식 뉴스 요약",
    "실적 요약",
    "한국 주식",
    "미국 주식",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
