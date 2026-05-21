import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SupabaseMissingBanner from "@/components/common/SupabaseMissingBanner";
import { getCurrentAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "스톡리포트 | 공시·뉴스·실적 AI 요약",
  description:
    "한국과 미국 주식의 공시, 뉴스, 실적 정보를 AI가 한눈에 정리해주는 정보 제공 서비스. 매수·매도 권유 없이 중립적으로 정리합니다.",
  keywords: [
    "스톡리포트",
    "주식 공시",
    "주식 뉴스 요약",
    "실적 요약",
    "AI 주식 정보",
    "한국 주식",
    "미국 주식",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, configured } = await getCurrentAuth();

  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
        {!configured && <SupabaseMissingBanner />}
        <Header userEmail={user?.email ?? null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
