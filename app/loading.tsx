import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-2xl border bg-card px-8 py-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <p className="text-sm font-medium text-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
