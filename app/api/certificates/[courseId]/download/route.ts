import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const MAX_CERTIFICATE_DOWNLOADS = 5;

export async function POST(
  _req: Request,
  { params }: { params: { courseId: string } },
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
  });

  if (!purchase) {
    return new NextResponse("Purchase not found", { status: 404 });
  }

  if (purchase.certificateDownloadCount >= MAX_CERTIFICATE_DOWNLOADS) {
    return NextResponse.json(
      {
        message:
          "You have reached your certificate download limit. Please contact the support team to get download access again.",
        remainingDownloads: 0,
      },
      { status: 403 },
    );
  }

  const updateResult = await db.purchase.updateMany({
    where: {
      userId,
      courseId: params.courseId,
      certificateDownloadCount: {
        lt: MAX_CERTIFICATE_DOWNLOADS,
      },
    },
    data: {
      certificateDownloadCount: {
        increment: 1,
      },
    },
  });

  if (updateResult.count === 0) {
    return NextResponse.json(
      {
        message:
          "You have reached your certificate download limit. Please contact the support team to get download access again.",
        remainingDownloads: 0,
      },
      { status: 403 },
    );
  }

  const updatedPurchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
    select: {
      certificateDownloadCount: true,
    },
  });

  return NextResponse.json({
    remainingDownloads: Math.max(
      0,
      MAX_CERTIFICATE_DOWNLOADS -
        (updatedPurchase?.certificateDownloadCount ?? MAX_CERTIFICATE_DOWNLOADS),
    ),
  });
}
