"use client";

/**
 * 현재 사용자 플랜을 React 컨텍스트로 노출합니다.
 *
 * 현재는 브라우저 localStorage(`sr:plan`)를 데이터 소스로 사용해 데모
 * 시나리오에서도 플랜 기반 화면 분기를 보여줄 수 있습니다. 후속 단계에서
 * Supabase 세션이 켜지면 useEffect에서 `localStorage` 대신 인증 API로
 * `profile.plan` 값을 가져오도록 한 줄만 교체하면 됩니다.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserPlan } from "@/lib/plans/types";

const STORAGE_KEY = "sr:plan";
const CHANGE_EVENT = "sr:plan:changed";

interface PlanContextValue {
  /** 현재 플랜 (hydration 전에는 "free"로 기본값 노출) */
  plan: UserPlan;
  /** 플랜을 직접 설정. 로컬 저장소에 반영되며, 같은 탭/다른 탭 양쪽에서 동기화 */
  setPlan: (plan: UserPlan) => void;
  /** hydration 완료 여부 — 로딩 스켈레톤 분기 등에 사용 */
  hydrated: boolean;
}

const PlanContext = createContext<PlanContextValue>({
  plan: "free",
  setPlan: () => {},
  hydrated: false,
});

function readStoredPlan(): UserPlan {
  if (typeof localStorage === "undefined") return "free";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "basic" || raw === "pro" || raw === "free") return raw;
    return "free";
  } catch {
    return "free";
  }
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<UserPlan>("free");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlanState(readStoredPlan());
    setHydrated(true);

    const onChange = () => setPlanState(readStoredPlan());
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, []);

  const setPlan = useCallback((next: UserPlan) => {
    setPlanState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // 저장 실패 시에도 React 상태는 갱신되어 화면은 정상 반영됨
    }
  }, []);

  return (
    <PlanContext.Provider value={{ plan, setPlan, hydrated }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan(): PlanContextValue {
  return useContext(PlanContext);
}
