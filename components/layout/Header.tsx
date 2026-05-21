"use client";

import Link from "next/link";
import { useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/search", label: "종목검색" },
  { href: "/briefing", label: "오늘의 브리핑" },
  { href: "/watchlist", label: "관심종목" },
  { href: "/pricing", label: "요금제" },
  { href: "/about", label: "서비스 소개" },
];

interface HeaderProps {
  userEmail: string | null;
}

export default function Header({ userEmail }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const isLoggedIn = Boolean(userEmail);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            스톡리포트
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/account"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                title={userEmail ?? undefined}
              >
                내 계정
              </Link>
              <LogoutButton className="btn-outline text-sm" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                로그인
              </Link>
              <Link href="/signup" className="btn-primary text-sm">
                회원가입
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="메뉴 열기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-200 pt-2">
              {isLoggedIn ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    내 계정
                  </Link>
                  <LogoutButton className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100" />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="btn-primary mt-1"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
