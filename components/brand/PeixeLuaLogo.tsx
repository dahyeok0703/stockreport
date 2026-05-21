"use client";

import { useState } from "react";
import { brandConfig } from "@/lib/brand";

type Variant = "iconOnly" | "wordmark" | "full";
type Size = "small" | "medium" | "large";

interface PeixeLuaLogoProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** 워드마크의 색상 — 푸터 등 어두운 배경 위에서 사용할 때 white 지정 */
  tone?: "default" | "muted" | "white";
  /** 로고 옆 보조 라벨 (예: "by") */
  label?: string;
}

const SIZE_HEIGHT: Record<Size, number> = {
  small: 20,
  medium: 28,
  large: 44,
};

const TEXT_SIZE: Record<Size, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-xl",
};

const ICON_SIZE: Record<Size, string> = {
  small: "h-5 w-5 text-[10px]",
  medium: "h-7 w-7 text-xs",
  large: "h-11 w-11 text-base",
};

const TONE: Record<NonNullable<PeixeLuaLogoProps["tone"]>, string> = {
  default: "text-slate-900",
  muted: "text-slate-500",
  white: "text-white",
};

/**
 * 운영사 페이시루아(PeixeLua) 로고.
 *
 * - 이미지가 없거나 onError 발생 시 텍스트/배지 fallback 으로 자동 전환
 * - SSR 안전 (useState 초기값 false, 브라우저에서만 error 전환)
 */
export default function PeixeLuaLogo({
  variant = "full",
  size = "medium",
  className,
  tone = "default",
  label,
}: PeixeLuaLogoProps) {
  const [errored, setErrored] = useState(false);

  const showImage = variant !== "wordmark" && !errored;
  const showText = variant !== "iconOnly";
  const altText = `${brandConfig.companyNameKo} ${brandConfig.companyNameEn} 로고`;

  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      aria-label={altText}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brandConfig.logoPath}
          alt={altText}
          height={SIZE_HEIGHT[size]}
          style={{
            height: `${SIZE_HEIGHT[size]}px`,
            width: "auto",
            display: "block",
          }}
          onError={() => setErrored(true)}
        />
      ) : variant !== "wordmark" ? (
        <span
          className={`inline-flex flex-shrink-0 items-center justify-center rounded-md bg-brand-700 font-bold text-white ${ICON_SIZE[size]}`}
          aria-hidden
        >
          P
        </span>
      ) : null}

      {showText && (
        <span className={`inline-flex items-baseline gap-1.5 ${TONE[tone]}`}>
          {label && (
            <span className="text-xs font-normal text-slate-400">{label}</span>
          )}
          <span
            className={`font-semibold tracking-tight ${TEXT_SIZE[size]}`}
          >
            {brandConfig.companyNameEn}
          </span>
        </span>
      )}
    </span>
  );
}
