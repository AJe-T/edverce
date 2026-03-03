import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CertificateClient } from "./_components/certificate-client";

const CertificatePage = async ({
  params,
}: {
  params: { courseId: string };
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

  const progressCount = await getProgress(userId, course.id);

  // Users must have 100% progress to view the certificate
  if (progressCount !== 100) {
    return redirect("/certificates");
  }

  const studentName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.emailAddresses[0]?.emailAddress ||
    "Student";

  // Create a predictable but unique looking certificate ID using course and user ID chunks
  const certIdChunk1 = course.id.substring(0, 4).toUpperCase();
  const certIdChunk2 = userId.substring(userId.length - 4).toUpperCase();
  const certIdChunk3 = "LMS1";
  const certificateId = `${certIdChunk1}-${certIdChunk2}-${certIdChunk3}`;

  // Find instructor from Clerk using clerkClient if we had it, but for now we'll mock the instructor details since the system only stores teacher's userId.
  const certData = {
    studentName,
    courseName: course.title,
    issueDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    certificateId,
    instructorName: "Platform Instructor",
    instructorRole: "Course Creator & Lead Expert",
  };

  return (
    <div className="h-full">
      <CertificateClient certData={certData} />
    </div>
  );
};

export default CertificatePage;
