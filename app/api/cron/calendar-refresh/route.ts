import { NextResponse, type NextRequest } from "next/server";
import {
  isCalendarAutoRefreshEnabled,
} from "@/lib/calendar/calendarRefreshConfig";
import { runCalendarRefresh } from "@/lib/calendar/calendarScheduler";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron 호출용 엔드포인트.
 *
 * vercel.json 예시:
 *   {
 *     "crons": [
 *       { "path": "/api/cron/calendar-refresh", "schedule": "*\/30 * * * *" }
 *     ]
 *   }
 *
 * 환경 변수:
 *   - CRON_SECRET (선택): 설정되어 있으면 Authorization: Bearer ${CRON_SECRET}
 *     헤더를 요구합니다. 없으면 인증 없이 호출 가능 (개발 단계).
 *   - CALENDAR_AUTO_REFRESH_ENABLED: false(기본)면 작업하지 않고 ok 반환.
 */
export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
  }

  if (!isCalendarAutoRefreshEnabled()) {
    return NextResponse.json({
      ok: true,
      enabled: false,
      message: "자동 갱신 비활성 상태입니다.",
      ranAt: new Date().toISOString(),
      results: [],
    });
  }

  const result = await runCalendarRefresh();
  return NextResponse.json({
    ok: true,
    enabled: result.enabled,
    ranAt: result.ranAt,
    results: result.results,
  });
}
