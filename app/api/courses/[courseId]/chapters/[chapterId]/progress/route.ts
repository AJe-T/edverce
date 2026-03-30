import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { findActivePurchase } from "@/lib/purchases";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
        isPublished: true,
      },
      select: {
        id: true,
        isFree: true,
      },
    });

    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    let activePurchase = null;

    if (!chapter.isFree) {
      activePurchase = await findActivePurchase({
        userId,
        courseId: params.courseId,
      });

      if (!activePurchase) {
        return new NextResponse("Course access expired", { status: 403 });
      }
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        }
      },
      update: {
        isCompleted
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      }
    })

    if (isCompleted) {
      const publishedChapters = await db.chapter.findMany({
        where: {
          courseId: params.courseId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });

      const publishedChapterIds = publishedChapters.map((item) => item.id);

      if (publishedChapterIds.length > 0) {
        const completedCount = await db.userProgress.count({
          where: {
            userId,
            chapterId: {
              in: publishedChapterIds,
            },
            isCompleted: true,
          },
        });

        if (completedCount === publishedChapterIds.length) {
          const purchase =
            activePurchase ||
            (await db.purchase.findUnique({
              where: {
                userId_courseId: {
                  userId,
                  courseId: params.courseId,
                },
              },
            }));

          if (purchase) {
            let certificateRecipientName: string | null = null;

            try {
              const learner = await clerkClient.users.getUser(userId);
              certificateRecipientName =
                `${learner.firstName || ""} ${learner.lastName || ""}`.trim() ||
                learner.username ||
                learner.emailAddresses?.[0]?.emailAddress ||
                "Student";
            } catch {
              certificateRecipientName = null;
            }

            await db.$executeRaw`
              UPDATE Purchase
              SET certificateIssuedAt = ${new Date()},
                  certificateRecipientName = ${certificateRecipientName || "Student"}
              WHERE userId = ${userId}
                AND courseId = ${params.courseId}
                AND certificateIssuedAt IS NULL
            `;
          }
        }
      }
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
