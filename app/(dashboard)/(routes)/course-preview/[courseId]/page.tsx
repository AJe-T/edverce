import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BookOpen, Clock3, Layers, Sparkles, Star } from "lucide-react";

import { db } from "@/lib/db";
import { getChapterSectionAndTitle } from "@/lib/chapter-sections";

import { CourseIntroCheckout } from "./_components/course-intro-checkout";

const CoursePreviewPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/search");
  }

  let purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  if (purchase) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    if (purchase.createdAt < threeMonthsAgo) {
      purchase = null;
    }
  }

  if (purchase) {
    return redirect(`/courses/${course.id}`);
  }

  const sectionToTopics = new Map<string, string[]>();

  for (const chapter of course.chapters) {
    const { section, lessonTitle } = getChapterSectionAndTitle(chapter.title);
    if (!sectionToTopics.has(section)) {
      sectionToTopics.set(section, []);
    }
    sectionToTopics.get(section)!.push(lessonTitle);
  }

  const topicGroups = Array.from(sectionToTopics.entries());
  const chapterCount = course.chapters.length;

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
          {course.category?.name && (
            <span className="px-2 py-1 rounded-full border bg-slate-50 dark:bg-slate-800">
              {course.category.name}
            </span>
          )}
          <span className="px-2 py-1 rounded-full border bg-slate-50 dark:bg-slate-800">
            {chapterCount} {chapterCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-3xl">
              {course.description ||
                "Master this course with structured lessons, practical flow, and guided progression."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-3 text-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <p className="flex items-center gap-2 font-medium">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Structured modules
                </p>
              </div>
              <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-3 text-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <p className="flex items-center gap-2 font-medium">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  Section-wise learning
                </p>
              </div>
              <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-3 text-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <p className="flex items-center gap-2 font-medium">
                  <Clock3 className="h-4 w-4 text-emerald-500" />
                  Learn at your own pace
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-xl border bg-white dark:bg-slate-900 shadow-lg">
              <Image
                src={course.imageUrl || "/marketing-hero.svg"}
                alt={course.title}
                width={960}
                height={540}
                className="h-auto w-full object-cover aspect-video"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Recommended by learners who want structured outcomes.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Course topics
            </h2>
            <div className="mt-4 space-y-4">
              {topicGroups.map(([sectionName, topics]) => (
                <div
                  key={sectionName}
                  className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-4 transition-all"
                >
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {sectionName}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    {topics.map((topic, index) => (
                      <li key={`${sectionName}-${topic}-${index}`}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {topicGroups.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Topics will be added soon.
                </p>
              )}
            </div>
          </div>
        </div>
        <CourseIntroCheckout
          courseId={course.id}
          coursePrice={course.price || 0}
          alreadyPurchased={!!purchase}
        />
      </div>
    </div>
  );
};

export default CoursePreviewPage;
