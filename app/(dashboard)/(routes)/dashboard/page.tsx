import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "../(root)/_components/info-card";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Your Courses
        </h2>
        <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      </div>
    </div>
  );
}
