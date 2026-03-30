"use client";

import { Download } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AnalyticsDataset } from "@/lib/analytics";

interface DownloadButtonProps {
  data: AnalyticsDataset;
}

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const toCsv = (data: AnalyticsDataset) => {
  const lines = [
    "Overview",
    "Metric,Value",
    `Filter Label,"${data.appliedFilters.label}"`,
    `Preset,${data.appliedFilters.preset}`,
    `Grouping,${data.appliedFilters.groupBy}`,
    `Start Date,${data.appliedFilters.startDate || "-"}`,
    `End Date,${data.appliedFilters.endDate || "-"}`,
    `Total Revenue,${data.overview.totalRevenue}`,
    `Total Sales,${data.overview.totalSales}`,
    `Unique Students,${data.overview.totalStudents}`,
    `Courses Sold,${data.overview.totalCourses}`,
    `Average Progress,${data.overview.averageProgress}`,
    `Completion Rate,${data.overview.completionRate}`,
    "",
    "Timeline",
    "Label,Revenue,Sales,Students",
    ...data.timeline.map(
      (point) => `"${point.label}",${point.revenue},${point.sales},${point.students}`,
    ),
    "",
    "Course Performance",
    "Course Title,Revenue,Sales,Students,Average Progress,Completion Rate,Price",
    ...data.coursePerformance.map(
      (course) =>
        `"${course.title}",${course.revenue},${course.sales},${course.students},${course.averageProgress},${course.completionRate},${course.price ?? ""}`,
    ),
  ];

  return lines.join("\n");
};

export const DownloadButton = ({ data }: DownloadButtonProps) => {
  const timestamp = new Date().toISOString().slice(0, 10);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            downloadFile(
              `edverce-analytics-${timestamp}.csv`,
              toCsv(data),
              "text/csv;charset=utf-8;",
            )
          }
        >
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            downloadFile(
              `edverce-analytics-${timestamp}.json`,
              JSON.stringify(data, null, 2),
              "application/json;charset=utf-8;",
            )
          }
        >
          Download JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
