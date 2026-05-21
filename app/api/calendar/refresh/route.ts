import { NextResponse } from "next/server";
import { runCalendarRefresh } from "@/lib/calendar/calendarScheduler";

export const dynamic = "force-dynamic";

/**
 * 수동 갱신 진입점. 현재 단계에서는 외부 API 호출이 일어나지 않습니다.
 * 추후 관리자/내부 호출용으로 권한 검증을 추가할 수 있습니다.
 */
export async function POST() {
  const result = await runCalendarRefresh();
  return NextResponse.json({
    ok: true,
    message: "일정 정보 기준이 갱신되었습니다.",
    refreshedAt: result.ranAt,
    enabled: result.enabled,
    status: result.results,
  });
}
