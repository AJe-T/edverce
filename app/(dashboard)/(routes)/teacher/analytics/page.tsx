import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Activity, DollarSign, Award } from "lucide-react";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { DownloadButton } from "./_components/download-button";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data, dailyData, totalRevenue, totalSales, totalStudents } =
    await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-x-2">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
        <DownloadButton data={data} dailyData={dailyData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Enrollments" value={totalSales} />
        <DataCard label="Unique Students" value={totalStudents} />
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Revenue Last 30 Days
          </h2>
          <Chart data={dailyData} />
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Course Performance
          </h2>
          <Chart data={data} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
