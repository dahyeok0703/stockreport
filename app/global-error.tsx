"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[stockreport] global-error boundary:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Pretendard', 'Noto Sans KR', sans-serif",
          backgroundColor: "#f7f9fc",
          color: "#0f172a",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            padding: 32,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            margin: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#b45309",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            오류
          </p>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginTop: 8,
              marginBottom: 8,
              color: "#0f172a",
            }}
          >
            화면을 표시하는 중 문제가 발생했습니다
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
            잠시 후 다시 시도해 주세요. 문제가 계속되면 페이지를 새로고침해
            주세요.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                background: "#274878",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
            <Link
              href="/"
              style={{
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 500,
                color: "#334155",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
