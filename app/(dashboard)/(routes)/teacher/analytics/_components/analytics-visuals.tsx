"use client";

import {
  Award,
  BadgeIndianRupee,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import type { AnalyticsDataset } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

type TimelineMetric = "revenue" | "sales" | "students";

interface AnalyticsVisualsProps {
  data: AnalyticsDataset;
  timelineMetric: TimelineMetric;
}

const leaderboardConfig = [
  {
    title: "Revenue leaders",
    icon: BadgeIndianRupee,
    itemsKey: "topRevenueCourses" as const,
    valueFormatter: (value: number) => formatPrice(value),
    getValue: (item: AnalyticsDataset["topRevenueCourses"][number]) => item.revenue,
    accent: "border-cyan-200 bg-cyan-50/80 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-300",
  },
  {
    title: "Most students",
    icon: Users,
    itemsKey: "topStudentCourses" as const,
    valueFormatter: (value: number) => `${value} learners`,
    getValue: (item: AnalyticsDataset["topStudentCourses"][number]) => item.students,
    accent: "border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  {
    title: "Best progress",
    icon: Award,
    itemsKey: "topProgressCourses" as const,
    valueFormatter: (value: number) => `${value.toFixed(1)}%`,
    getValue: (item: AnalyticsDataset["topProgressCourses"][number]) => item.averageProgress,
    accent: "border-violet-200 bg-violet-50/80 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
  },
  {
    title: "Needs attention",
    icon: TrendingDown,
    itemsKey: "lowestProgressCourses" as const,
    valueFormatter: (value: number) => `${value.toFixed(1)}%`,
    getValue: (item: AnalyticsDataset["lowestProgressCourses"][number]) => item.averageProgress,
    accent: "border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },
];

const timelineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.12)",
      },
    },
  },
};

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.12)",
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const metricMeta: Record<
  TimelineMetric,
  { label: string; color: string; helper: string }
> = {
  revenue: {
    label: "Revenue",
    color: "rgba(8, 145, 178, 1)",
    helper: "Track earnings across your selected time range.",
  },
  sales: {
    label: "Sales",
    color: "rgba(16, 185, 129, 1)",
    helper: "Monitor enrollments and buying momentum.",
  },
  students: {
    label: "Students",
    color: "rgba(249, 115, 22, 1)",
    helper: "See unique learners entering the funnel.",
  },
};

const AnalyticsVisuals = ({
  data,
  timelineMetric,
}: AnalyticsVisualsProps) => {
  const timelineMeta = metricMeta[timelineMetric];
  const topRevenueCourses = data.topRevenueCourses.slice(0, 6);
  const progressCourses = data.coursePerformance.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Trend explorer
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                {timelineMeta.label} over time
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {timelineMeta.helper}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Range
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {data.appliedFilters.label}
              </p>
            </div>
          </div>

          <div className="mt-6 h-[360px]">
            <Line
              options={timelineOptions}
              data={{
                labels: data.timeline.map((point) => point.label),
                datasets: [
                  {
                    label: timelineMeta.label,
                    data: data.timeline.map((point) => point[timelineMetric]),
                    borderColor: timelineMeta.color,
                    backgroundColor: timelineMeta.color.replace(", 1)", ", 0.16)"),
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                  },
                  {
                    label: "Sales",
                    data: data.timeline.map((point) => point.sales),
                    borderColor: "rgba(15, 23, 42, 0.35)",
                    backgroundColor: "rgba(15, 23, 42, 0.12)",
                    tension: 0.3,
                    pointRadius: 0,
                    borderDash: [6, 6],
                  },
                ],
              }}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Best sellers
              </p>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Courses driving revenue
              </h2>
            </div>
          </div>

          <div className="mt-6 h-[360px]">
            <Bar
              options={horizontalBarOptions}
              data={{
                labels: topRevenueCourses.map((course) => course.title),
                datasets: [
                  {
                    label: "Revenue",
                    data: topRevenueCourses.map((course) => course.revenue),
                    borderRadius: 12,
                    backgroundColor: [
                      "rgba(8, 145, 178, 0.92)",
                      "rgba(14, 116, 144, 0.88)",
                      "rgba(6, 95, 70, 0.88)",
                      "rgba(59, 130, 246, 0.82)",
                      "rgba(99, 102, 241, 0.82)",
                      "rgba(236, 72, 153, 0.82)",
                    ],
                  },
                ],
              }}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-3 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Learning quality
              </p>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Progress and completion by course
              </h2>
            </div>
          </div>

          <div className="mt-6 h-[360px]">
            <Bar
              options={horizontalBarOptions}
              data={{
                labels: progressCourses.map((course) => course.title),
                datasets: [
                  {
                    label: "Average progress %",
                    data: progressCourses.map((course) => course.averageProgress),
                    borderRadius: 12,
                    backgroundColor: "rgba(99, 102, 241, 0.88)",
                  },
                  {
                    label: "Completion rate %",
                    data: progressCourses.map((course) => course.completionRate),
                    borderRadius: 12,
                    backgroundColor: "rgba(16, 185, 129, 0.7)",
                  },
                ],
              }}
            />
          </div>
        </section>

        <section className="grid gap-6">
          {leaderboardConfig.map((leaderboard) => {
            const items = data[leaderboard.itemsKey];
            const Icon = leaderboard.icon;

            return (
              <div
                key={leaderboard.title}
                className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-2xl border p-3", leaderboard.accent)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950 dark:text-white">
                      {leaderboard.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Top courses in the current filter window
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {items.length ? (
                    items.map((item, index) => (
                      <div
                        key={`${leaderboard.title}-${item.courseId}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            {`${`${index + 1}`.padStart(2, "0")}`}
                          </p>
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {leaderboard.valueFormatter(leaderboard.getValue(item))}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      No course data is available for this range yet.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Full breakdown
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              Course performance table
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {data.coursePerformance.length} courses in this view
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="pb-4 font-medium">Course</th>
                <th className="pb-4 font-medium">Revenue</th>
                <th className="pb-4 font-medium">Sales</th>
                <th className="pb-4 font-medium">Students</th>
                <th className="pb-4 font-medium">Avg. progress</th>
                <th className="pb-4 font-medium">Completion</th>
              </tr>
            </thead>
            <tbody>
              {data.coursePerformance.length ? (
                data.coursePerformance.map((course) => (
                  <tr
                    key={course.courseId}
                    className="border-b border-slate-100 align-top dark:border-slate-900"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium text-slate-950 dark:text-white">
                        {course.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Price: {course.price ? formatPrice(course.price) : "Not set"}
                      </p>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-slate-100">
                      {formatPrice(course.revenue)}
                    </td>
                    <td className="py-4 pr-4 text-slate-700 dark:text-slate-200">
                      {course.sales}
                    </td>
                    <td className="py-4 pr-4 text-slate-700 dark:text-slate-200">
                      {course.students}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-700 dark:text-slate-200">
                            {course.averageProgress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${Math.min(course.averageProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-2">
                        <span className="text-slate-700 dark:text-slate-200">
                          {course.completionRate.toFixed(1)}%
                        </span>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No analytics are available for the selected range yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsVisuals;
