import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
  icon?: LucideIcon;
  helperText?: string;
  accentClassName?: string;
  suffix?: string;
}

export const DataCard = ({
  value,
  label,
  shouldFormat,
  icon: Icon,
  helperText,
  accentClassName,
  suffix,
}: DataCardProps) => {
  return (
   <Card className="border-slate-200/70 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
      <div className="space-y-1">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </CardTitle>
        {helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
      {Icon ? (
        <div
          className={cn(
            "rounded-xl border px-3 py-3 text-slate-700 dark:text-slate-100",
            accentClassName || "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/40",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {shouldFormat ? formatPrice(value) : Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 1,
        }).format(value)}
        {suffix || ""}
      </div>
    </CardContent>
   </Card>
  )
}
