import { NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/auth";
import { getAiSummary } from "@/lib/ai/summaryService";
import { fitToBudget } from "@/lib/ai/tokenBudget";
import { getAiConfig } from "@/lib/ai/config";
import type {
  AiSummaryRequest,
  AiSummaryType,
} from "@/lib/ai/types";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: AiSummaryType[] = [
  "stock_overview",
  "filings",
  "news",
  "earnings",
  "financials",
  "integrated_report",
];

const MAX_BODY_BYTES = 32 * 1024; // 32 KB — 클라이언트 남용 방지

interface PostBody {
  type?: string;
  market?: string;
  symbol?: string;
  companyName?: string;
  inputData?: Record<string, unknown>;
  force?: boolean;
}

export async function POST(req: Request) {
  // 1) 크기 제한
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json(
      { ok: false, error: "request body unreadable" },
      { status: 400 },
    );
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "request body too large" },
      { status: 413 },
    );
  }

  let body: PostBody;
  try {
    body = raw ? (JSON.parse(raw) as PostBody) : {};
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }

  // 2) 필수 필드 검증
  const type = body.type as AiSummaryType | undefined;
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      { ok: false, error: "invalid type" },
      { status: 400 },
    );
  }
  const market = body.market;
  if (market !== "kr" && market !== "us") {
    return NextResponse.json(
      { ok: false, error: "invalid market" },
      { status: 400 },
    );
  }
  if (!body.symbol || !body.companyName) {
    return NextResponse.json(
      { ok: false, error: "symbol and companyName required" },
      { status: 400 },
    );
  }
  if (!body.inputData || typeof body.inputData !== "object") {
    return NextResponse.json(
      { ok: false, error: "inputData required" },
      { status: 400 },
    );
  }

  // 3) 로그인 필요 (남용 방지)
  const { user, profile } = await getCurrentAuth();
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        reason: "login_required",
        message: "AI 요약을 사용하려면 로그인이 필요합니다.",
      },
      { status: 401 },
    );
  }

  // 4) 입력 길이 제한 후 호출
  const cfg = getAiConfig();
  const budgeted = fitToBudget(
    // tokenBudget의 fitToBudget는 CompactStockInput 가정이지만 일반 객체도 안전하게 처리
    body.inputData as unknown as Parameters<typeof fitToBudget>[0],
    cfg.maxInputChars,
  );

  const aiReq: AiSummaryRequest = {
    type,
    market,
    symbol: body.symbol,
    companyName: body.companyName,
    inputData: budgeted.payload as unknown as Record<string, unknown>,
    language: "ko",
    userPlan: profile?.plan,
  };

  const envelope = await getAiSummary(aiReq, { force: Boolean(body.force) });
  return NextResponse.json(envelope, { status: 200 });
}
