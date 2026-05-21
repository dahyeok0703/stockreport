import { NextResponse, type NextRequest } from "next/server";
import { mockStocks } from "@/lib/mockStocks";
import { listSeedMappings } from "@/lib/data/stockMappings";
import type { NormalizedStock, StockMarket } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

function isMarket(v: string | null): v is StockMarket {
  return v === "kr" || v === "us";
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get("query") ?? "").trim().toLowerCase();
  const marketParam = searchParams.get("market");
  const market = isMarket(marketParam) ? marketParam : null;

  // Merge seed mappings + mockStocks (mockStocks are richer for UI cards)
  const map = new Map<string, NormalizedStock>();

  for (const m of listSeedMappings(market ?? undefined)) {
    const key = `${m.market}:${m.symbol.toLowerCase()}`;
    map.set(key, {
      name: m.name,
      symbol: m.symbol,
      market: m.market,
      exchange: m.exchange,
      country: m.country,
      sector: m.sector,
      industry: m.industry,
      description: null,
    });
  }

  for (const s of mockStocks ?? []) {
    if (market && s.market !== market) continue;
    const key = `${s.market}:${s.symbol.toLowerCase()}`;
    map.set(key, {
      name: s.name,
      symbol: s.symbol,
      market: s.market,
      exchange: s.exchange,
      country: s.country,
      sector: s.sector,
      industry: s.industry,
      description: s.description,
    });
  }

  let results = Array.from(map.values());
  if (q) {
    results = results.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.symbol.toLowerCase().includes(q) ||
        (r.industry ?? "").toLowerCase().includes(q) ||
        (r.sector ?? "").toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q)
      );
    });
  }

  return NextResponse.json({
    ok: true,
    count: results.length,
    results,
  });
}
