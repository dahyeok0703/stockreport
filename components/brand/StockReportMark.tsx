/**
 * 스톡리포트 워드마크 옆에 붙는 "S" 심볼.
 *
 * 남색 배경 박스 없이, 한 번에 휘갈긴 듯한 굵은 검은 곡선으로
 * 표현합니다. 색상은 `currentColor` 를 따르므로, 부모에서 `text-slate-900`
 * 또는 `text-white` 등으로 톤을 바꿀 수 있습니다.
 */

interface StockReportMarkProps {
  /** px 단위 정사각형 크기 */
  size?: number;
  className?: string;
}

export default function StockReportMark({
  size = 32,
  className,
}: StockReportMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M25 7.5 C 21.5 3.5, 12.5 4, 9.5 8.5 C 6.5 13, 11 15.5, 16 16.5 C 22 17.6, 26 20.5, 24.8 24.5 C 23.5 28.5, 13 30, 6 24.2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
