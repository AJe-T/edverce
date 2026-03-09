import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CertificateClient } from "./_components/certificate-client";

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
  let studentName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.emailAddresses[0]?.emailAddress ||
    "Student";

  // If a teacher wants to view their student's certificate, securely switch context
  if (searchParams?.studentId && course.userId === userId) {
    targetUserId = searchParams.studentId;
    try {
      const studentUser = await clerkClient.users.getUser(targetUserId);
      studentName =
        `${studentUser.firstName || ""} ${studentUser.lastName || ""}`.trim() ||
        studentUser.emailAddresses[0]?.emailAddress ||
        "Student";
    } catch {
      // safe fallback
    }
  }

  const progressCount = await getProgress(targetUserId, course.id);

  // Users must have 100% progress to view the certificate
  if (progressCount !== 100) {
    return redirect("/certificates");
  }

  // Create a predictable but unique looking certificate ID using course and user ID chunks
  const certIdChunk1 = course.id.substring(0, 4).toUpperCase();
  const certIdChunk2 = targetUserId
    .substring(targetUserId.length - 4)
    .toUpperCase();
  const certIdChunk3 = "LMS1";
  const certificateId = `${certIdChunk1}-${certIdChunk2}-${certIdChunk3}`;

  // Fetch actual instructor from Clerk using clerkClient
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
    userProgressList.length > 0 ? userProgressList[0].updatedAt : new Date();

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
    instructorRole: "Course Creator",
  };

  return (
    <div className="h-full">
      <CertificateClient certData={certData} />
    </div>
  );
};

export default CertificatePage;
