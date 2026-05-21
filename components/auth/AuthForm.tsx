"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    if (isSignup) {
      if (password.length < 6) {
        setError("비밀번호는 6자 이상이어야 합니다.");
        return;
      }
      if (password !== confirm) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError(
        "Supabase 환경 변수가 설정되지 않아 인증 기능을 사용할 수 없습니다.",
      );
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) {
          setError(translateAuthError(signUpError.message));
          return;
        }
        if (data.session) {
          // 자동 로그인됨 (이메일 확인 비활성화 프로젝트)
          router.replace(nextPath);
          router.refresh();
          return;
        }
        // 이메일 확인 필요
        setInfo(
          "확인 메일을 보냈습니다. 메일함에서 인증 링크를 클릭한 뒤 로그인해 주세요.",
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(translateAuthError(signInError.message));
          return;
        }
        router.replace(nextPath);
        router.refresh();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder={isSignup ? "6자 이상" : "비밀번호"}
          required
        />
      </div>

      {isSignup && (
        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            비밀번호 확인
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-900">
          {info}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60"
      >
        {loading
          ? "처리 중…"
          : isSignup
            ? "회원가입"
            : "로그인"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {isSignup ? (
          <>
            이미 계정이 있으신가요?{" "}
            <Link
              href={`/login${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="font-medium text-brand-700 hover:underline"
            >
              로그인
            </Link>
          </>
        ) : (
          <>
            아직 계정이 없으신가요?{" "}
            <Link
              href={`/signup${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="font-medium text-brand-700 hover:underline"
            >
              회원가입
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("user already registered"))
    return "이미 가입된 이메일입니다. 로그인해 주세요.";
  if (m.includes("email not confirmed"))
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.";
  if (m.includes("password should be at least"))
    return "비밀번호가 너무 짧습니다. 6자 이상 입력해 주세요.";
  return message;
}
