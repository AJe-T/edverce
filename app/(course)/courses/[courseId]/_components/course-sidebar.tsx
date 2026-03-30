import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { findActivePurchase } from "@/lib/purchases";
import { CourseProgress } from "@/components/course-progress";
import { getChapterSectionAndTitle } from "@/lib/chapter-sections";

import { CourseSidebarSections } from "./course-sidebar-sections";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await findActivePurchase({
    userId,
    courseId: course.id,
  });

  const sectionMap = new Map<
    string,
    {
      id: string;
      label: string;
      items: Array<{
        id: string;
        label: string;
        isCompleted: boolean;
        isLocked: boolean;
      }>;
    }
  >();

  let isPreviousCompleted = true;

  for (const chapter of course.chapters) {
    const { section, lessonTitle } = getChapterSectionAndTitle(chapter.title);
    if (!sectionMap.has(section)) {
      sectionMap.set(section, {
        id: section.toLowerCase().replace(/\s+/g, "-"),
        label: section,
        items: [],
      });
    }

    const isCompleted = !!chapter.userProgress?.[0]?.isCompleted;
    const isLocked = (!chapter.isFree && !purchase) || !isPreviousCompleted;

    sectionMap.get(section)!.items.push({
      id: chapter.id,
      label: lessonTitle,
      isCompleted,
      isLocked,
    });

    isPreviousCompleted = isCompleted;
  }

  const sections = Array.from(sectionMap.values());

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-card">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <CourseSidebarSections courseId={course.id} sections={sections} />
    </div>
  );
};
