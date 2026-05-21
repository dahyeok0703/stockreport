"use client";

/**
 * 인증 힌트 — 사용자가 이미 회원가입 흐름을 거쳤는지 여부를 브라우저에
 * 저장해 두는 가벼운 플래그.
 *
 * 실제 인증 상태(Supabase 세션)는 아니지만, "관심종목 추가" 버튼 같은
 * 어드미션 UI에서 회원가입 vs 로그인 페이지 분기를 자연스럽게 하는 데
 * 사용합니다. 후속 단계에서 Supabase 세션이 연결되면 이 플래그 대신
 * 실제 세션 상태를 사용하면 됩니다.
 */

const KEY = "sr:hasAccount";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function hasAccountHint(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setAccountHint(): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // ignore
  }
}

export function clearAccountHint(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
