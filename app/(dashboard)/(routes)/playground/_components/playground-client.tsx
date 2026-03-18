"use client";

import { useState } from "react";
import { Maximize, Minimize, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PlaygroundClient = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={cn(
        "w-full flex flex-col  bg-background",
        isFullscreen
          ? "fixed inset-0 z-[99999] p-2"
          : "p-6 gap-4 h-[calc(100vh-80px)]",
      )}
    >
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-x-2">
          {!isFullscreen && (
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Code2 className="h-6 w-6 text-blue-500" />
            </div>
          )}
          <div>
            <h1
              className={cn(
                "font-bold text-slate-900 dark:text-white",
                isFullscreen ? "text-lg" : "text-2xl",
              )}
            >
              Code Playground
            </h1>
            {!isFullscreen && (
              <p className="text-sm text-slate-500 mt-1">
                Experiment with React, Node, or Vanilla JS directly in the
                browser. Powered by CodeSandbox.
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-2"
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-4 h-4" /> Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="w-4 h-4" /> Fullscreen Mode
            </>
          )}
        </Button>
      </div>

      <div className="flex-grow w-full border border-border/60 rounded-xl overflow-hidden shadow-sm bg-slate-950 relative group">
        <div
          className="absolute top-0 right-0 w-[150px] h-[50px] bg-transparent z-[50]"
          title="External jumping disabled."
        />

        <iframe
          title="CodeSandbox Playground"
          src="https://codesandbox.io/embed/new?codemirror=1&view=split&theme=dark"
          style={{
            width: "100%",
            height: "100%",
            border: "0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          className="absolute inset-0"
        />
      </div>
    </div>
  );
};
