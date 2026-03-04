import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const [categories, courses] = await Promise.all([
    db.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    getCourses({
      userId,
      ...searchParams,
    }),
  ]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pt-8">
      <div className="w-full relative rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 shadow-sm dark:shadow-xl mb-6 transition-colors">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Explore our premium catalog.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium mt-2">
              Master new technologies. Access 100+ project-based courses taught
              by industry veterans.
            </p>
          </div>
        </div>
      </div>

      <Categories items={categories} />
      <div className="mt-8">
        <CoursesList items={courses} />
      </div>
    </div>
  );
};

export default SearchPage;
