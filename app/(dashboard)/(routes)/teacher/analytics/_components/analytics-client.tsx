"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  DollarSign,
  Filter,
  Loader2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataCard } from "./data-card";
import { DownloadButton } from "./download-button";
import { AnalyticsLoading } from "./analytics-loading";
import {
  ANALYTICS_GROUP_BY,
  type AnalyticsDataset,
  type AnalyticsFilters,
  type AnalyticsGroupBy,
  type AnalyticsPreset,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

const AnalyticsVisuals = dynamic(
  () => import("./analytics-visuals"),
  {
    ssr: false,
    loading: () => <AnalyticsLoading label="Rendering interactive charts..." />,
  },
);

type TimelineMetric = "revenue" | "sales" | "students";

const presetButtons: {
  label: string;
  value: AnalyticsPreset;
  defaultGroupBy: AnalyticsGroupBy;
}[] = [
  { label: "Today", value: "day", defaultGroupBy: "hour" },
  { label: "Last 7 days", value: "week", defaultGroupBy: "day" },
  { label: "Last 30 days", value: "month", defaultGroupBy: "day" },
  { label: "All time", value: "all", defaultGroupBy: "month" },
  { label: "Custom", value: "custom", defaultGroupBy: "day" },
];

const defaultFilters: Required<AnalyticsFilters> = {
  preset: "month",
  groupBy: "day",
  startDate: "",
  endDate: "",
};

const toQueryString = (filters: AnalyticsFilters) => {
  const params = new URLSearchParams();

  if (filters.preset) params.set("preset", filters.preset);
  if (filters.groupBy) params.set("groupBy", filters.groupBy);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  return params.toString();
};

const AnalyticsClient = () => {
  const [draftFilters, setDraftFilters] =
    useState<Required<AnalyticsFilters>>(defaultFilters);
  const [data, setData] = useState<AnalyticsDataset | null>(null);
  const [timelineMetric, setTimelineMetric] =
    useState<TimelineMetric>("revenue");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async (
    filters: Required<AnalyticsFilters>,
    mode: "initial" | "refresh" = "refresh",
  ) => {
    if (mode === "initial") {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const response = await fetch(`/api/analytics?${toQueryString(filters)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load analytics right now.");
      }

      const nextData = (await response.json()) as AnalyticsDataset;
      setData(nextData);
      setDraftFilters({
        preset: nextData.appliedFilters.preset,
        groupBy: nextData.appliedFilters.groupBy,
        startDate: nextData.appliedFilters.startDate || "",
        endDate: nextData.appliedFilters.endDate || "",
      });
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load analytics right now.";

      setError(message);

      if (mode !== "initial") {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadAnalytics(defaultFilters, "initial");
  }, []);

  const handlePresetChange = (preset: AnalyticsPreset) => {
    const presetConfig = presetButtons.find((item) => item.value === preset);
    const nextFilters = {
      preset,
      groupBy: presetConfig?.defaultGroupBy || "day",
      startDate: preset === "custom" ? draftFilters.startDate : "",
      endDate: preset === "custom" ? draftFilters.endDate : "",
    };

    setDraftFilters(nextFilters);

    if (preset !== "custom") {
      void loadAnalytics(nextFilters, "refresh");
    }
  };

  const applyCustomFilters = () => {
    if (draftFilters.preset !== "custom") {
      void loadAnalytics(draftFilters, "refresh");
      return;
    }

    if (!draftFilters.startDate || !draftFilters.endDate) {
      toast.error("Select both start and end dates for a custom range.");
      return;
    }

    if (draftFilters.startDate > draftFilters.endDate) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    void loadAnalytics(draftFilters, "refresh");
  };

  if (isLoading && !data) {
    return <AnalyticsLoading fullScreen label="Loading the analytics command center..." />;
  }

  return (
    <div className="p-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-6 shadow-sm dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.96))] sm:p-8">
        {isRefreshing && data ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px] bg-white/75 backdrop-blur-sm dark:bg-slate-950/70">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
              <p className="text-sm font-medium">Refreshing analytics view...</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Activity className="h-3.5 w-3.5" />
              Teacher Analytics
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Full-platform analytics for every teacher
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              This view now aggregates across the whole platform, supports quick presets plus custom calendar filtering,
              and lazy-loads the charting layer only when the analytics page is opened.
            </p>
          </div>

          {data ? <DownloadButton data={data} /> : null}
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {presetButtons.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={draftFilters.preset === preset.value ? "default" : "outline"}
                  className={cn(
                    "rounded-full",
                    draftFilters.preset === preset.value &&
                      "bg-slate-950 text-white hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
                  )}
                  onClick={() => handlePresetChange(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {(["revenue", "sales", "students"] as TimelineMetric[]).map((metric) => (
                <Button
                  key={metric}
                  type="button"
                  variant={timelineMetric === metric ? "default" : "outline"}
                  className={cn(
                    "rounded-full capitalize",
                    timelineMetric === metric &&
                      "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400",
                  )}
                  onClick={() => setTimelineMetric(metric)}
                >
                  {metric}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_auto]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <CalendarRange className="h-3.5 w-3.5" />
                  Start date
                </label>
                <Input
                  type="date"
                  value={draftFilters.startDate || ""}
                  disabled={draftFilters.preset !== "custom"}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <CalendarRange className="h-3.5 w-3.5" />
                  End date
                </label>
                <Input
                  type="date"
                  value={draftFilters.endDate || ""}
                  disabled={draftFilters.preset !== "custom"}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                Group by
              </label>
              <select
                value={draftFilters.groupBy}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    groupBy: event.target.value as AnalyticsGroupBy,
                  }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {ANALYTICS_GROUP_BY.map((groupBy) => (
                  <option key={groupBy} value={groupBy}>
                    {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                className="w-full gap-2 lg:w-auto"
                onClick={applyCustomFilters}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                Apply filters
              </Button>
            </div>
          </div>

          {data ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-medium text-slate-700 dark:text-slate-200">{data.appliedFilters.label}</span> grouped by{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">{data.appliedFilters.groupBy}</span>.
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DataCard
                label="Total Revenue"
                value={data.overview.totalRevenue}
                shouldFormat
                icon={DollarSign}
                helperText="Gross revenue in this range"
                accentClassName="border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30"
              />
              <DataCard
                label="Total Sales"
                value={data.overview.totalSales}
                icon={BookOpen}
                helperText="Completed enrollments"
                accentClassName="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
              />
              <DataCard
                label="Unique Students"
                value={data.overview.totalStudents}
                icon={Users}
                helperText="Distinct learners"
                accentClassName="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
              />
              <DataCard
                label="Courses Sold"
                value={data.overview.totalCourses}
                icon={BookOpen}
                helperText="Courses with activity"
                accentClassName="border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30"
              />
              <DataCard
                label="Average Progress"
                value={data.overview.averageProgress}
                suffix="%"
                icon={Activity}
                helperText="Across active courses"
                accentClassName="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
              />
              <DataCard
                label="Completion Rate"
                value={data.overview.completionRate}
                suffix="%"
                icon={CheckCircle2}
                helperText="Students reaching 100%"
                accentClassName="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
              />
            </div>

            <div className="mt-6">
              <AnalyticsVisuals
                data={data}
                timelineMetric={timelineMetric}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AnalyticsClient;
