import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { DashboardClient } from "./_components/dashboard-client";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-y-2 mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="text-slate-500 max-w-2xl text-lg">
          Pick up where you left off or discover new courses to expand your
          skill set.
        </p>
      </div>

      <DashboardClient 
        completedCourses={completedCourses} 
        coursesInProgress={coursesInProgress} 
      />
    </div>
  );
}
