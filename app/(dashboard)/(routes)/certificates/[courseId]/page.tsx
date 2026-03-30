import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CertificateClient } from "./_components/certificate-client";

const MAX_CERTIFICATE_DOWNLOADS = 5;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@edverce.com";

const CertificatePage = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams?: { studentId?: string };
}) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/certificates");
  }

  let targetUserId = userId;
  let fallbackStudentName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.emailAddresses[0]?.emailAddress ||
    "Student";
  const isTeacherView = Boolean(
    searchParams?.studentId && course.userId === userId,
  );

  if (isTeacherView && searchParams?.studentId) {
    targetUserId = searchParams.studentId;
    try {
      const studentUser = await clerkClient.users.getUser(targetUserId);
      fallbackStudentName =
        `${studentUser.firstName || ""} ${studentUser.lastName || ""}`.trim() ||
        studentUser.emailAddresses[0]?.emailAddress ||
        "Student";
    } catch {
      // safe fallback
    }
  }

  const progressCount = await getProgress(targetUserId, course.id);

  if (progressCount !== 100) {
    return redirect("/certificates");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: targetUserId,
        courseId: course.id,
      },
    },
    select: {
      certificateDownloadCount: true,
    },
  });

  if (!purchase) {
    return redirect("/certificates");
  }

  const certificateSnapshotRows = await db.$queryRaw<
    { certificateRecipientName: string | null; certificateIssuedAt: Date | null }[]
  >`
    SELECT certificateRecipientName, certificateIssuedAt
    FROM Purchase
    WHERE userId = ${targetUserId}
      AND courseId = ${course.id}
    LIMIT 1
  `;

  const certificateSnapshot = certificateSnapshotRows[0] || {
    certificateRecipientName: null,
    certificateIssuedAt: null,
  };

  const certIdChunk1 = course.id.substring(0, 4).toUpperCase();
  const certIdChunk2 = targetUserId
    .substring(targetUserId.length - 4)
    .toUpperCase();
  const certIdChunk3 = "Edverce";
  const certificateId = `${certIdChunk1}-${certIdChunk2}-${certIdChunk3}`;

  let instructorName = "Course Instructor";
  try {
    const instructorUser = await clerkClient.users.getUser(course.userId);
    instructorName =
      `${instructorUser.firstName || ""} ${instructorUser.lastName || ""}`.trim() ||
      "Course Instructor";
  } catch {
    // safe fallback
  }

  const userProgressList = await db.userProgress.findMany({
    where: {
      userId: targetUserId,
      chapterId: {
        in: course.chapters.map((c) => c.id),
      },
      isCompleted: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 1,
  });

  const completionDate =
    certificateSnapshot.certificateIssuedAt ||
    (userProgressList.length > 0 ? userProgressList[0].updatedAt : new Date());

  const studentName =
    certificateSnapshot.certificateRecipientName || fallbackStudentName;

  const certData = {
    studentName,
    courseName: course.title,
    issueDate: completionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    certificateId,
    instructorName,
    instructorSignature: course.certificateSignature || instructorName,
    instructorSignatureUrl: course.certificateSignatureUrl || null,
    instructorRole: "Course Creator",
  };

  return (
    <div className="h-full">
      <CertificateClient
        certData={certData}
        courseId={course.id}
        enforceDownloadLimit={!isTeacherView}
        remainingDownloads={Math.max(
          0,
          MAX_CERTIFICATE_DOWNLOADS - purchase.certificateDownloadCount,
        )}
        supportEmail={SUPPORT_EMAIL}
      />
    </div>
  );
};

export default CertificatePage;
