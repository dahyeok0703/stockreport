export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function formatMarketLabel(market: "kr" | "us") {
  return market === "kr" ? "한국" : "미국";
}

export function getStockReportHref(market: "kr" | "us", symbol: string) {
  return `/stocks/${market}/${symbol}`;
}

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatNumberKorean(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
