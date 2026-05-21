import type { PriceSnapshot, Stock } from "@/lib/mockStocks";

/**
 * 종목별 결정론적 데모 가격 정보 생성기.
 * 실제 시세 연동은 정식 서비스 단계에서 제공될 예정이며, 본 모듈은
 * 종목 헤더에 표시할 "데모 가격 정보"를 시드 기반으로 안정적으로 만듭니다.
 */

const DEMO_AS_OF = "2026-05-20 18:00 (데모 기준 시각)";

const KRW_BASE: Record<string, number> = {
  "005930": 72_800,
  "000660": 218_500,
  "035420": 188_400,
  "035720": 49_900,
  "005380": 261_500,
  "000270": 116_700,
  "068270": 198_300,
  "012450": 612_000,
  "034020": 24_650,
  "373220": 372_500,
};

const USD_BASE: Record<string, number> = {
  AAPL: 218.45,
  MSFT: 432.18,
  NVDA: 142.6,
  TSLA: 184.72,
  PLTR: 89.4,
  GOOGL: 178.55,
  AMZN: 219.3,
  META: 545.8,
  AMD: 124.6,
  SOUN: 14.85,
};

function seedHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function fmtKrw(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n)) + "원";
}

function fmtKrwMarketCap(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}조 원`;
  if (n >= 1e8) return `${(n / 1e8).toFixed(0)}억 원`;
  return fmtKrw(n);
}

function fmtUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function fmtUsdMarketCap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return fmtUsd(n);
}

function fmtVolume(n: number): string {
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)}억주`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}만주`;
  return new Intl.NumberFormat("ko-KR").format(n) + "주";
}

function fmtVolumeUs(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

/**
 * 종목 데이터에 priceSnapshot이 있으면 그대로 반환,
 * 없으면 시드 기반으로 결정론적 데모 값을 생성합니다.
 */
export function getDemoPriceSnapshot(stock: Stock): PriceSnapshot {
  if (stock.priceSnapshot) return stock.priceSnapshot;

  const h = seedHash(`${stock.market}:${stock.symbol}`);
  // -3.20% ~ +3.20% 범위의 결정론적 변동률
  const pct = ((h % 641) - 320) / 100;

  if (stock.market === "kr") {
    const base = KRW_BASE[stock.symbol] ?? 50_000 + (h % 50_000);
    const current = Math.round(base * (1 + pct / 100));
    const changeAbs = current - base;
    // 거래량 50만 ~ 1500만주
    const volume = 500_000 + (h % 14_500_000);
    // 시가총액 1조 ~ 600조 KRW
    const marketCap = 1e12 + ((h >> 3) % 5.99e14);
    return {
      currency: "KRW",
      current,
      changeAbs,
      changePct: Number(pct.toFixed(2)),
      volume,
      marketCap: fmtKrwMarketCap(marketCap),
      asOf: DEMO_AS_OF,
    };
  }

  const base = USD_BASE[stock.symbol] ?? 50 + (h % 500);
  const current = Number((base * (1 + pct / 100)).toFixed(2));
  const changeAbs = Number((current - base).toFixed(2));
  // 5M ~ 80M shares
  const volume = 5_000_000 + (h % 75_000_000);
  // $50B ~ $3.5T
  const marketCap = 5e10 + ((h >> 3) % 3.45e12);
  return {
    currency: "USD",
    current,
    changeAbs,
    changePct: Number(pct.toFixed(2)),
    volume,
    marketCap: fmtUsdMarketCap(marketCap),
    asOf: DEMO_AS_OF,
  };
}

export function formatDemoPrice(snap: PriceSnapshot): string {
  return snap.currency === "KRW" ? fmtKrw(snap.current) : fmtUsd(snap.current);
}

export function formatDemoChange(snap: PriceSnapshot): {
  abs: string;
  pct: string;
  isPositive: boolean;
  isNegative: boolean;
} {
  const sign = snap.changeAbs > 0 ? "+" : snap.changeAbs < 0 ? "" : "";
  const abs =
    snap.currency === "KRW"
      ? `${sign}${fmtKrw(snap.changeAbs)}`
      : `${sign}${fmtUsd(snap.changeAbs)}`;
  const pctSign = snap.changePct > 0 ? "+" : "";
  const pct = `${pctSign}${snap.changePct.toFixed(2)}%`;
  return {
    abs,
    pct,
    isPositive: snap.changePct > 0,
    isNegative: snap.changePct < 0,
  };
}

export function formatDemoVolume(snap: PriceSnapshot): string {
  return snap.currency === "KRW"
    ? fmtVolume(snap.volume)
    : fmtVolumeUs(snap.volume);
}
