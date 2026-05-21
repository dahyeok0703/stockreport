"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import {
  getAllScheduleItems,
  type ScheduleItem,
} from "@/lib/mockBriefing";

type RegionFilter = "all" | "한국" | "미국" | "글로벌";
type TypeFilter = "all" | ScheduleItem["type"];

const regionFilters: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "한국", label: "한국" },
  { value: "미국", label: "미국" },
  { value: "글로벌", label: "글로벌" },
];

const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "실적", label: "실적" },
  { value: "공시", label: "공시" },
  { value: "경제지표", label: "경제지표" },
  { value: "배당·주총", label: "배당·주총" },
];

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
  } catch {
    return iso;
  }
}

function groupByDate(items: ScheduleItem[]): Map<string, ScheduleItem[]> {
  const m = new Map<string, ScheduleItem[]>();
  for (const it of items) {
    const list = m.get(it.date) ?? [];
    list.push(it);
    m.set(it.date, list);
  }
  return new Map(
    Array.from(m.entries()).sort(([a], [b]) => (a < b ? -1 : 1)),
  );
}

const TYPE_BADGE: Record<ScheduleItem["type"], string> = {
  실적: "bg-brand-50 text-brand-800 border-brand-200",
  공시: "bg-emerald-50 text-emerald-800 border-emerald-200",
  경제지표: "bg-amber-50 text-amber-800 border-amber-200",
  "배당·주총": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function CalendarPage() {
  const [region, setRegion] = useState<RegionFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  const all = useMemo(() => getAllScheduleItems(), []);
  const filtered = useMemo(() => {
    return all.filter((it) => {
      if (region !== "all" && it.region !== region) return false;
      if (type !== "all" && it.type !== type) return false;
      return true;
    });
  }, [all, region, type]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="캘린더"
        title="실적·공시·경제지표 일정"
        description="이번 주~다음 주 주요 실적 발표, 공시, 경제지표, 배당/주총 일정을 한 곳에서 확인합니다."
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="badge-slate">정보 제공용 자료</span>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            지역
          </p>
          <div className="flex flex-wrap gap-1.5">
            {regionFilters.map((f) => (
              <Chip
                key={f.value}
                active={region === f.value}
                onClick={() => setRegion(f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            유형
          </p>
          <div className="flex flex-wrap gap-1.5">
            {typeFilters.map((f) => (
              <Chip
                key={f.value}
                active={type === f.value}
                onClick={() => setType(f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-600">
          일정 <span className="font-semibold text-slate-900">{filtered.length}</span>건
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">
            선택한 필터에 해당하는 일정이 없습니다.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {Array.from(grouped.entries()).map(([date, items]) => (
            <section key={date}>
              <div className="mb-2 flex items-baseline gap-3">
                <h2 className="text-base font-bold text-slate-900">
                  {fmtDate(date)}
                </h2>
                <span className="text-xs text-slate-500">{date}</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
                <ul className="divide-y divide-slate-200">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[it.type]}`}
                        >
                          {it.type}
                        </span>
                        <span className="badge-slate">{it.region}</span>
                        <span className="text-sm font-medium text-slate-900">
                          {it.title}
                        </span>
                      </div>
                      {it.note && (
                        <span className="text-xs text-slate-500">
                          {it.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "border-brand-600 bg-brand-50 text-brand-800"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
