import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getProgress } from "@/actions/get-progress";
import { StudentsTable } from "./_components/students-table";

export default async function StudentsPage() {
  const { userId } = auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    include: {
      purchases: true,
      chapters: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  const studentIds = new Set<string>();
  courses.forEach((course) => {
    course.purchases.forEach((purchase) => {
      studentIds.add(purchase.userId);
    });
  });

  const uniqueStudentIds = Array.from(studentIds);

  let clerkUsers: any[] = [];
  if (uniqueStudentIds.length > 0) {
    try {
      clerkUsers = await clerkClient.users.getUserList({
        userId: uniqueStudentIds,
      });
    } catch (error) {
      console.log("[CLERK_USERS_ERROR]", error);
    }
  }

  const students = await Promise.all(
    uniqueStudentIds.map(async (studentId) => {
      const clerkUser = clerkUsers.find((u) => u.id === studentId);

      const email =
        clerkUser?.emailAddresses?.[0]?.emailAddress || "Unknown Email";
      const name = clerkUser
        ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
        : "Unknown User";
      const imageUrl = clerkUser?.imageUrl || "";

      const enrolledCourses = courses.filter((c) =>
        c.purchases.some((p) => p.userId === studentId),
      );

      const enrolledCoursesWithProgress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const progress = await getProgress(studentId, course.id);
          const purchaseRecord = course.purchases.find(
            (p) => p.userId === studentId,
          );

          let purchasedAt = null;
          let expiresAt = null;

          if (purchaseRecord) {
            purchasedAt = purchaseRecord.createdAt;
            const expiration = new Date(purchaseRecord.createdAt);
            expiration.setMonth(expiration.getMonth() + 3);
            expiresAt = expiration;
          }

          return {
            id: course.id,
            title: course.title,
            progress: progress || 0,
            purchasedAt,
            expiresAt,
            price: purchaseRecord?.price ?? course.price ?? 0,
            couponCode: purchaseRecord?.couponCode || null,
            transactionId: purchaseRecord?.transactionId || null,
          };
        }),
      );

      return {
        id: studentId,
        email,
        name: name || "Unknown User",
        imageUrl,
        courses: enrolledCoursesWithProgress,
      };
    }),
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">All Students</h1>
      </div>

      <StudentsTable students={students} />
    </div>
  );
}

