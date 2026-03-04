import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-x-4 p-6 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md hover:border-blue-500/30">
      <IconBadge variant={variant} icon={Icon} />
      <div className="flex flex-col">
        <p className="font-bold text-lg text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
