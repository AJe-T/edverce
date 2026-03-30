import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastModifiedBy = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
        lastModifiedBy
      }
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}