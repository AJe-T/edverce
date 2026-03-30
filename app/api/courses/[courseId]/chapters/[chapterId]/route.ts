import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getYoutubeVideoId } from "@/lib/youtube";
import { toStoredChapterTitle } from "@/lib/chapter-sections";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.muxData.deleteMany({
      where: {
        chapterId: params.chapterId,
      }
    });

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
      }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      }
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { isPublished, section, ...values } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (typeof values.videoUrl === "string" && !getYoutubeVideoId(values.videoUrl)) {
      return new NextResponse("Invalid YouTube URL", { status: 400 });
    }

    if (typeof values.title === "string") {
      values.title = toStoredChapterTitle(section || "General", values.title);
    }

    const lastModifiedBy = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        lastModifiedBy
      }
    });

    await db.course.update({
      where: { id: params.courseId },
      data: { lastModifiedBy }
    });

    if (values.videoUrl) {
      await db.muxData.deleteMany({
        where: {
          chapterId: params.chapterId,
        }
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}
