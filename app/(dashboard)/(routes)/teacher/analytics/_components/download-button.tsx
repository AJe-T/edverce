"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  data: { name: string; total: number; sales: number }[];
  dailyData: { name: string; total: number }[];
}

export const DownloadButton = ({ data, dailyData }: DownloadButtonProps) => {
  const downloadCSV = () => {
    // 1. Generate Course Performance CSV
    let courseCsv = "Course Title,Total Revenue,Total Sales\n";
    courseCsv += data
      .map((d) => `"${d.name}",${d.total},${d.sales}`)
      .join("\n");

    // 2. Generate Daily Revenue CSV
    let dailyCsv = "\n\nDate,Revenue\n";
    dailyCsv += dailyData.map((d) => `"${d.name}",${d.total}`).join("\n");

    const fullCsv = courseCsv + dailyCsv;

    // Create Blob and trigger download
    const blob = new Blob([fullCsv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "edverce_analytics_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={downloadCSV}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export CSV Report
    </Button>
  );
};
