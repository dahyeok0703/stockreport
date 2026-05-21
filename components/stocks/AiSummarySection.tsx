"use client";

import { useCallback, useEffect, useState } from "react";
import type { AiSummaryEnvelope } from "@/lib/ai/types";

interface AiSummarySectionProps {
  market: "kr" | "us";
  symbol: string;
  /** 1B의 prop 시그니처 호환 (현재는 사용하지 않음) */
  isLoggedIn?: boolean;
  aiEnabled?: boolean;
}

type State =
  | { kind: "loading" }
  | { kind: "ok"; envelope: AiSummaryEnvelope }
  | { kind: "error"; message: string };

export default function AiSummarySection({
  market,
  symbol,
}: AiSummarySectionProps) {
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(
    async (force = false) => {
      setState({ kind: "loading" });
      try {
        const url = `/api/stocks/${market}/${symbol}/ai-summary${
          force ? "?force=1" : ""
        }`;
        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json()) as AiSummaryEnvelope;
        setState({ kind: "ok", envelope: data });
      } catch (e) {
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "요약을 불러오지 못했습니다",
        });
      }
    },
    [market, symbol],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return (
    <div className="card p-6">
      <Header state={state} onRefresh={() => void load(true)} />

      <div className="mt-4">
        {state.kind === "loading" && <Skeleton />}
        {state.kind === "error" && (
          <p className="text-sm text-slate-600">
            요약을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {state.kind === "ok" && <Body envelope={state.envelope} />}
      </div>
    </div>
  );
}

function Header({
  state,
  onRefresh,
}: {
  state: State;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-medium text-slate-500">
        {state.kind === "loading"
          ? "요약을 불러오는 중…"
          : "정보 제공용 요약"}
      </span>
      {state.kind !== "loading" && (
        <button
          type="button"
          onClick={onRefresh}
          className="btn-outline text-xs"
        >
          새로고침
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded bg-slate-50" />
        <div className="h-20 animate-pulse rounded bg-slate-50" />
      </div>
    </div>
  );
}

function Body({ envelope }: { envelope: AiSummaryEnvelope }) {
  // 내부 실패/한도 등은 사용자에게 노출하지 않고 fallback 요약을 그대로 보여줍니다.
  const r =
    envelope.result ??
    envelope.fallback ?? {
      summary:
        "현재 표시 가능한 요약이 충분하지 않습니다. 원문 출처에서 정보를 확인해 주세요.",
      keyPoints: [],
      checkpoints: [],
      sourceBasedNotes: [],
      limitations: [],
      summaryType: "integrated_report" as const,
      generatedAt: new Date().toISOString(),
      model: "",
      dataStatus: "mock" as const,
      containsInvestmentAdvice: false,
      blockedPhrasesFound: [],
      warnings: [],
    };

  return (
    <div className="space-y-5">
      <p className="text-sm leading-7 text-slate-800">{r.summary}</p>
      <Lists r={r} />
      <Footer generatedAt={r.generatedAt} />
    </div>
  );
}

function Lists({
  r,
}: {
  r: {
    keyPoints: string[];
    checkpoints: string[];
    sourceBasedNotes: string[];
    limitations: string[];
  };
}) {
  const groups: { title: string; items: string[] }[] = [
    { title: "핵심 정보", items: r.keyPoints },
    { title: "확인할 항목", items: r.checkpoints },
    { title: "원문 기반 참고사항", items: r.sourceBasedNotes },
    { title: "데이터 한계", items: r.limitations },
  ];
  const visible = groups.filter((g) => g.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {visible.map((g) => (
        <div
          key={g.title}
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {g.title}
          </h4>
          <ul className="mt-2 space-y-1.5">
            {g.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Footer({ generatedAt }: { generatedAt: string }) {
  let when = "";
  try {
    when = new Date(generatedAt).toLocaleString("ko-KR");
  } catch {
    when = generatedAt;
  }
  return (
    <p className="border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
      데이터 기준 · {when}. 본 요약은 정보 제공용입니다. 원문 데이터를
      바탕으로 생성되며, 오류나 누락이 있을 수 있으니 원문을 함께 확인해 주세요.
    </p>
  );
}
