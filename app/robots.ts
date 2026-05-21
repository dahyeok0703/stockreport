import type { MetadataRoute } from "next";

/**
 * 정식 출시 전 — 모든 경로에 대해 검색엔진 색인 차단.
 * 정식 출시 시점에 Disallow를 제거하고 sitemap을 추가하면 됩니다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
