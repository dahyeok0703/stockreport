"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSubmit?: (value: string) => void;
  size?: "md" | "lg";
}

export default function SearchBar({
  placeholder = "종목명 또는 티커를 입력하세요",
  initialValue = "",
  onSubmit,
  size = "md",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (onSubmit) {
      onSubmit(trimmed);
      return;
    }
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    router.push(`/search${query}`);
  };

  const sizing =
    size === "lg"
      ? "h-14 text-base sm:text-lg pl-12 pr-32 sm:pr-36"
      : "h-11 text-sm pl-10 pr-24";

  const buttonSizing =
    size === "lg"
      ? "right-1.5 top-1.5 bottom-1.5 px-5 text-sm"
      : "right-1 top-1 bottom-1 px-3 text-xs";

  const iconSizing = size === "lg" ? "h-5 w-5 left-4" : "h-4 w-4 left-3";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full"
      role="search"
    >
      <svg
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${iconSizing}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${sizing}`}
      />
      <button
        type="submit"
        className={`absolute rounded-lg bg-brand-700 font-semibold text-white hover:bg-brand-800 ${buttonSizing}`}
      >
        검색
      </button>
    </form>
  );
}
