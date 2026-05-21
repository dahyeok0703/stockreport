"use client";

import { useEffect, useRef } from "react";
import { incrementReportView } from "@/lib/usage";

interface ReportViewTrackerProps {
  market: string;
  symbol: string;
}

/**
 * Fires once on mount to increment the current user's daily report view
 * count. The check + block happens server-side; this is only the counter.
 */
export default function ReportViewTracker({
  market,
  symbol,
}: ReportViewTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void incrementReportView().catch(() => {
      // silently ignore — UI still rendered.
    });
    // included for future per-symbol tracking refinement
    void market;
    void symbol;
  }, [market, symbol]);

  return null;
}
