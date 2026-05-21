import { NextResponse } from "next/server";
import { getStockReport } from "@/lib/data/stockDataService";
import type { StockMarket } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

function isMarket(v: string): v is StockMarket {
  return v === "kr" || v === "us";
}

export async function GET(
  _req: Request,
  { params }: { params: { market: string; symbol: string } },
) {
  if (!isMarket(params.market)) {
    return NextResponse.json(
      { ok: false, error: "invalid market" },
      { status: 400 },
    );
  }
  try {
    const report = await getStockReport(params.market, params.symbol);
    if (!report) {
      return NextResponse.json(
        { ok: false, error: "stock not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
