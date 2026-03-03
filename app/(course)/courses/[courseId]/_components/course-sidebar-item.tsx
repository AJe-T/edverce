"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    if (isLocked) {
      return;
    }
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex w-full items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-6 transition-all",
        !isLocked && "hover:text-foreground hover:bg-muted/60",
        isLocked && "cursor-not-allowed opacity-60",
        isActive &&
          !isLocked &&
          "text-primary bg-primary/10 hover:bg-primary/10 hover:text-primary",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-muted-foreground",
            isActive && "text-primary",
            isCompleted && "text-emerald-700",
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-primary h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700",
        )}
      />
    </button>
  );
};
