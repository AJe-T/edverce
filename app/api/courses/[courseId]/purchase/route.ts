import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getPhonePeOrderStatus } from "@/lib/phonepe";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const user = await currentUser();
    const requestUrl = new URL(req.url);
    const merchantOrderId = requestUrl.searchParams.get("merchantOrderId");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!merchantOrderId) {
      return new NextResponse("Invalid payment payload", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const paymentStatus = await getPhonePeOrderStatus(merchantOrderId);
    const paid =
      paymentStatus.state === "COMPLETED" ||
      paymentStatus.paymentDetails?.some(
        (detail) => detail.state === "COMPLETED",
      ) ||
      false;

    const statusQuery = new URL(`${appUrl}/courses/${params.courseId}`);

    if (!paid) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("state", paymentStatus.state);
      return NextResponse.redirect(statusQuery);
    }

    if (
      paymentStatus.metaInfo?.udf1 &&
      paymentStatus.metaInfo.udf1 !== user.id
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      paymentStatus.metaInfo?.udf2 &&
      paymentStatus.metaInfo.udf2 !== params.courseId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.purchase.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
      create: {
        courseId: params.courseId,
        userId: user.id,
      },
      update: {
        createdAt: new Date(),
      },
    });

    statusQuery.searchParams.set("payment", "success");
    return NextResponse.redirect(statusQuery);
  } catch (error) {
    console.log("[COURSE_ID_PURCHASE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
