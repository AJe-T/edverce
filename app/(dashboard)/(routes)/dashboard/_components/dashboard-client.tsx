"use client";

import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "../../(root)/_components/info-card";

interface DashboardClientProps {
  completedCourses: any[];
  coursesInProgress: any[];
}

export const DashboardClient = ({
  completedCourses,
  coursesInProgress,
}: DashboardClientProps) => {
  const [filter, setFilter] = useState<"all" | "inProgress" | "completed">("all");

  const displayedCourses = 
    filter === "inProgress" ? coursesInProgress
    : filter === "completed" ? completedCourses
    : [...coursesInProgress, ...completedCourses];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setFilter(filter === "inProgress" ? "all" : "inProgress")}
          className={`cursor-pointer transition-all duration-300 rounded-2xl ${filter === "inProgress" ? "ring-2 ring-blue-500 scale-[1.02]" : "hover:scale-[1.02]"}`}
        >
          <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
          />
        </div>
        <div 
          onClick={() => setFilter(filter === "completed" ? "all" : "completed")}
          className={`cursor-pointer transition-all duration-300 rounded-2xl ${filter === "completed" ? "ring-2 ring-emerald-500 scale-[1.02]" : "hover:scale-[1.02]"}`}
        >
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Your Courses 
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({filter === "inProgress" ? "In Progress" : filter === "completed" ? "Completed" : "All"})
            </span>
          </h2>
        </div>
        <CoursesList items={displayedCourses} />
      </div>
    </>
  );
};
