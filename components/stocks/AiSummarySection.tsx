"use client";

import { useCallback, useEffect, useState } from "react";
import type { AiSummaryEnvelope } from "@/lib/ai/types";

interface AiSummarySectionProps {
  market: "kr" | "us";
  symbol: string;
  /** 로그인 안 했을 때는 안내 표시 후 mock fetch */
  isLoggedIn: boolean;
  aiEnabled: boolean;
}

type State =
  | { kind: "loading" }
  | { kind: "ok"; envelope: AiSummaryEnvelope }
  | { kind: "error"; message: string };

export default function AiSummarySection({
  market,
  symbol,
  isLoggedIn,
  aiEnabled,
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
          message: e instanceof Error ? e.message : "AI 요약 호출 실패",
        });
      }
    },
    [market, symbol],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return (
    <section id="ai-summary" className="scroll-mt-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-brand-700 px-2 text-xs font-bold uppercase text-white">
          AI
        </span>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          AI 정보 요약
        </h2>
      </div>

      <p className="mb-3 text-sm leading-6 text-slate-600">
        이 요약은 공시·뉴스·실적자료 등 제공된 정보를 바탕으로 생성된 정보
        제공용 요약입니다. 특정 종목의 매수·매도·보유를 권유하지 않습니다.
      </p>

      <div className="card p-6">
        <Header
          state={state}
          isLoggedIn={isLoggedIn}
          aiEnabled={aiEnabled}
          onRefresh={() => void load(true)}
        />

        <div className="mt-4">
          {state.kind === "loading" && <Skeleton />}
          {state.kind === "error" && (
            <p className="text-sm text-rose-700">
              AI 요약을 불러오지 못했습니다 ({state.message}). 기본 리포트
              정보는 계속 확인할 수 있습니다.
            </p>
          )}
          {state.kind === "ok" && <Body envelope={state.envelope} />}
        </div>
      </div>
    </section>
  );
}

// -------------------- header --------------------

function statusFromEnvelope(env: AiSummaryEnvelope): {
  label: string;
  className: string;
} {
  if (!env.ok) {
    if (env.reason === "limit_exceeded") {
      return {
        label: "사용량 한도 초과",
        className: "bg-amber-50 text-amber-800 border border-amber-200",
      };
    }
    if (env.reason === "data_insufficient") {
      return {
        label: "데이터 부족",
        className: "bg-slate-100 text-slate-700 border border-slate-200",
      };
    }
    if (env.reason === "disabled") {
      return {
        label: "AI 요약 비활성화",
        className: "bg-slate-100 text-slate-700 border border-slate-200",
      };
    }
    if (env.reason === "login_required") {
      return {
        label: "로그인 필요",
        className: "bg-slate-100 text-slate-700 border border-slate-200",
      };
    }
    return {
      label: "오류",
      className: "bg-rose-50 text-rose-800 border border-rose-200",
    };
  }
  const ds = env.result?.dataStatus;
  if (ds === "ai")
    return {
      label: "AI 요약 사용 가능",
      className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    };
  if (ds === "cached")
    return {
      label: "캐시된 AI 요약",
      className: "bg-brand-50 text-brand-800 border border-brand-200",
    };
  if (ds === "fallback")
    return {
      label: "AI 호출 실패 — fallback 요약",
      className: "bg-amber-50 text-amber-800 border border-amber-200",
    };
  return {
    label: "목업 AI 요약",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  };
}

function Header({
  state,
  isLoggedIn,
  aiEnabled,
  onRefresh,
}: {
  state: State;
  isLoggedIn: boolean;
  aiEnabled: boolean;
  onRefresh: () => void;
}) {
  const showRefresh = state.kind !== "loading";
  let badge: { label: string; className: string } | null = null;
  if (state.kind === "ok") badge = statusFromEnvelope(state.envelope);
  if (state.kind === "loading")
    badge = {
      label: "불러오는 중…",
      className: "bg-slate-100 text-slate-700 border border-slate-200",
    };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {badge && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${badge.className}`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {badge.label}
          </span>
        )}
        {!aiEnabled && (
          <span className="text-xs text-slate-500">
            서버 측 AI 호출이 비활성화 상태입니다.
          </span>
        )}
        {!isLoggedIn && (
          <span className="text-xs text-slate-500">
            로그인하면 사용량이 추적되며 AI 요약 캐시가 사용자별로 관리됩니다.
          </span>
        )}
      </div>
      {showRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="btn-outline text-xs"
        >
          AI 정보 요약 새로고침
        </button>
      )}
    </div>
  );
}

// -------------------- body --------------------

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
  if (!envelope.ok && envelope.reason === "limit_exceeded") {
    return (
      <FallbackBlock
        message={
          envelope.message ??
          "오늘의 AI 요약 사용 한도를 모두 사용했습니다. 기본 리포트 정보는 계속 확인할 수 있습니다."
        }
        result={envelope.fallback}
      />
    );
  }
  if (!envelope.ok && envelope.reason === "data_insufficient") {
    return (
      <FallbackBlock
        message={
          envelope.message ??
          "현재 AI 요약에 사용할 수 있는 데이터가 충분하지 않습니다. 원문 공시와 뉴스 링크를 함께 확인해 주세요."
        }
      />
    );
  }
  if (!envelope.ok) {
    return (
      <FallbackBlock
        message={
          envelope.message ?? "AI 요약을 사용할 수 없습니다."
        }
        result={envelope.fallback}
      />
    );
  }

  const r = envelope.result;
  if (!r) return <FallbackBlock message="AI 요약 결과가 비어 있습니다." />;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-7 text-slate-800">{r.summary}</p>

      <Lists r={r} />

      {r.warnings.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {r.warnings.map((w, i) => (
            <div key={i}>· {w}</div>
          ))}
        </div>
      )}

      <Footer
        generatedAt={r.generatedAt}
        model={r.model}
        dataStatus={r.dataStatus}
      />
    </div>
  );
}

function Lists({
  r,
}: {
  r: NonNullable<AiSummaryEnvelope["result"]>;
}) {
  const groups: { title: string; items: string[] }[] = [
    { title: "핵심 정보", items: r.keyPoints },
    { title: "확인할 항목", items: r.checkpoints },
    { title: "원문 기반 참고사항", items: r.sourceBasedNotes },
    { title: "데이터 한계", items: r.limitations },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {groups
        .filter((g) => g.items.length > 0)
        .map((g) => (
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

function Footer({
  generatedAt,
  model,
  dataStatus,
}: {
  generatedAt: string;
  model: string;
  dataStatus: string;
}) {
  return (
    <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
      <p>
        생성 시각:{" "}
        <span className="text-slate-700">
          {new Date(generatedAt).toLocaleString("ko-KR")}
        </span>
        · 모델: <span className="text-slate-700">{model}</span>
        · 상태: <span className="text-slate-700">{dataStatus}</span>
      </p>
      <p className="mt-1">
        본 AI 요약은 정보 제공용입니다. AI 요약은 원문 데이터를 바탕으로
        생성되며, 오류나 누락이 있을 수 있습니다.
      </p>
    </div>
  );
}

function FallbackBlock({
  message,
  result,
}: {
  message: string;
  result?: AiSummaryEnvelope["result"];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        {message}
      </div>
      {result && (
        <>
          <p className="text-sm leading-7 text-slate-700">{result.summary}</p>
          <Lists r={result} />
          <Footer
            generatedAt={result.generatedAt}
            model={result.model}
            dataStatus={result.dataStatus}
          />
        </>
      )}
    </div>
  );
}
