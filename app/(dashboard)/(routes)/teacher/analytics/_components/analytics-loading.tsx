"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface AnalyticsLoadingProps {
  fullScreen?: boolean;
  label?: string;
}

const skeletonCards = Array.from({ length: 6 });

export const AnalyticsLoading = ({
  fullScreen = false,
  label = "Preparing analytics workspace...",
}: AnalyticsLoadingProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-slate-200 shadow-sm",
        "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_40%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.98))] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.10),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_40%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.96))]",
        fullScreen
          ? "fixed inset-0 z-50 m-0 rounded-none border-0 p-6"
          : "m-6 p-8",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 text-slate-700 dark:text-slate-200",
          fullScreen &&
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
        <p className="text-sm font-medium">{label}</p>
      </div>

      {!fullScreen && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              />
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="h-[420px] animate-pulse rounded-3xl border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
            <div className="grid gap-6">
              <div className="h-[200px] animate-pulse rounded-3xl border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
              <div className="h-[200px] animate-pulse rounded-3xl border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
            </div>
          </div>

          <div className="mt-6 h-[320px] animate-pulse rounded-3xl border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
        </>
      )}
    </div>
  );
};
