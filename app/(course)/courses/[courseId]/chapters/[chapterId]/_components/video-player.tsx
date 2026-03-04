"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          },
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted flex-col gap-y-2 text-foreground">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked &&
        (embedUrl ? (
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden bg-black group shadow-2xl border border-slate-800"
            onContextMenu={(e) => e.preventDefault()} // Disable right click
          >
            {/* Top Security Mask: Blocks title clicks, channel clicks, and 'Copy link' button */}
            <div
              className="absolute top-0 left-0 right-0 h-[70px] bg-transparent z-[50]"
              title="External actions disabled"
            />

            {/* Bottom-Right Security Mask: Blocks the YouTube Logo click */}
            <div
              className="absolute bottom-[40px] right-0 w-[120px] h-[50px] bg-transparent z-[50]"
              title="External actions disabled"
            />

            {/* Bottom-Left Security Mask: Blocks Watch on YouTube click */}
            <div
              className="absolute bottom-[40px] left-0 w-[150px] h-[60px] bg-transparent z-[50]"
              title="External actions disabled"
            />

            {/* Top Right Visual Watermark (Covers the YouTube 'Copy link' functionality) */}
            <div className="absolute top-0 right-0 w-32 h-[60px] bg-[#000000] z-[60] flex items-center justify-end pr-4 pointer-events-none opacity-100">
              <span className="text-white/80 text-xs font-bold tracking-[0.2em]">
                EDVERCE
              </span>
            </div>

            <iframe
              title={title}
              src={embedUrl}
              className={cn("w-full h-full", !isReady && "hidden")}
              onLoad={() => setIsReady(true)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted flex-col gap-y-2 text-foreground">
            <p className="text-sm">Invalid YouTube video URL</p>
          </div>
        ))}
    </div>
  );
};
