"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
}

export const CategoryItem = ({
  label,
  value,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-4 text-sm font-medium border rounded-full flex items-center gap-x-2 transition-all duration-200",
        isSelected
          ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-sm"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm",
      )}
      type="button"
    >
      <div className="truncate">{label}</div>
    </button>
  );
};
