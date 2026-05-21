import { NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/auth";
import { getStockReport } from "@/lib/data/stockDataService";
import { getStockIntegratedAiSummary } from "@/lib/ai/summaryService";
import type { StockMarket } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

function isMarket(v: string): v is StockMarket {
  return v === "kr" || v === "us";
}

export async function GET(
  req: Request,
  { params }: { params: { market: string; symbol: string } },
) {
  if (!isMarket(params.market)) {
    return NextResponse.json(
      { ok: false, error: "invalid market" },
      { status: 400 },
    );
  }

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";

  const report = await getStockReport(params.market, params.symbol);
  if (!report) {
    return NextResponse.json(
      { ok: false, error: "stock not found" },
      { status: 404 },
    );
  }

  const { profile } = await getCurrentAuth();

  const envelope = await getStockIntegratedAiSummary(
    report,
    profile?.plan,
    { force },
  );

  if (!envelope.ok) {
    return NextResponse.json(envelope, { status: 200 });
  }
  return NextResponse.json(envelope, { status: 200 });
}
