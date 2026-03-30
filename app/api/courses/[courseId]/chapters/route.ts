import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { toStoredChapterTitle } from "@/lib/chapter-sections";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { title, section } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastModifiedBy = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure we track who last modified the entire course too
    await db.course.update({
      where: { id: params.courseId },
      data: { lastModifiedBy }
    });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title: toStoredChapterTitle(section || "General", title),
        courseId: params.courseId,
        position: newPosition,
        lastModifiedBy,
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
