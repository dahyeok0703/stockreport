/**
 * 사업자 정보. 환경변수가 모두 비어 있으면 푸터·약관 등에서 사업자 정보
 * 섹션 자체를 숨깁니다. 실제 사업자 등록 후 환경변수만 채우면 자동으로
 * 표시됩니다.
 */

export interface BusinessInfo {
  legalName: string;
  representative?: string;
  registrationNumber?: string;
  mailOrderNumber?: string;
  address?: string;
  supportEmail?: string;
  supportPhone?: string;
}

export function getBusinessInfo(): BusinessInfo | null {
  const legalName =
    process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ||
    process.env.COMPANY_LEGAL_NAME ||
    "";
  const representative =
    process.env.NEXT_PUBLIC_COMPANY_REPRESENTATIVE ||
    process.env.COMPANY_REPRESENTATIVE ||
    "";
  const registrationNumber =
    process.env.NEXT_PUBLIC_COMPANY_REG_NO ||
    process.env.COMPANY_REG_NO ||
    "";
  const mailOrderNumber =
    process.env.NEXT_PUBLIC_COMPANY_MAILORDER_NO ||
    process.env.COMPANY_MAILORDER_NO ||
    "";
  const address =
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS || process.env.COMPANY_ADDRESS || "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || process.env.SUPPORT_EMAIL || "";
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE || process.env.SUPPORT_PHONE || "";

  if (
    !legalName &&
    !representative &&
    !registrationNumber &&
    !mailOrderNumber &&
    !address &&
    !supportEmail &&
    !supportPhone
  ) {
    return null;
  }

  return {
    legalName: legalName || "스톡리포트",
    representative: representative || undefined,
    registrationNumber: registrationNumber || undefined,
    mailOrderNumber: mailOrderNumber || undefined,
    address: address || undefined,
    supportEmail: supportEmail || undefined,
    supportPhone: supportPhone || undefined,
  };
}
