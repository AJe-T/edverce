"use client";

import { Loader2 } from "lucide-react";

import { useRequestLoader } from "@/hooks/use-request-loader";

export const GlobalLoader = () => {
  const pendingCount = useRequestLoader((state) => state.pendingCount);
  const isVisible = pendingCount > 0;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-2xl border border-white/20 bg-slate-950/90 px-8 py-6 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
          <p className="text-sm font-medium tracking-wide">
            Processing your request...
          </p>
        </div>
      </div>
    </div>
  );
};
