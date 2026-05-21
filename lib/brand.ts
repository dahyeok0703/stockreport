/**
 * 운영사·서비스 브랜드 정보.
 *
 * 운영사: 페이시루아 (PeixeLua)
 * 서비스: 스톡리포트
 *
 * 화면에 표시되는 브랜드 라벨은 모두 이 파일에서 가져옵니다.
 * 로고 파일은 public/brand/ 아래에 두며, 파일이 없거나 로딩 실패해도
 * PeixeLuaLogo 컴포넌트의 텍스트 fallback 으로 안전하게 표시됩니다.
 */

export const brandConfig = {
  companyNameKo: "페이시루아",
  companyNameEn: "PeixeLua",
  companyTagline: "디지털 서비스 창작 브랜드",

  serviceNameKo: "스톡리포트",
  serviceNameEn: "StockReport",

  // public/ 기준 경로 — 파일이 아직 없어도 onError fallback 됩니다.
  logoPath: "/brand/peixelua-logo.png",
  logoTransparentPath: "/brand/peixelua-logo-transparent.png",
  iconPath: "/brand/peixelua-icon.png",

  // 후속 단계에서 실제 도메인으로 교체. 현재는 표시용 자리.
  supportEmail: "support@stockreport.kr",
} as const;

export type BrandConfig = typeof brandConfig;
