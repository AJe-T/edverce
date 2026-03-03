import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Users, BookOpen, Percent } from "lucide-react";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

export default async function StudentsPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // 1. Fetch courses owned by the teacher
  const courses = await db.course.findMany({
    where: {
      userId: userId,
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

  // 2. Extract unique student IDs from purchases
  const studentIds = new Set<string>();
  courses.forEach((course) => {
    course.purchases.forEach((purchase) => {
      studentIds.add(purchase.userId);
    });
  });

  const uniqueStudentIds = Array.from(studentIds);

  // 3. Fetch user details from Clerk
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

  // 4. Map user details to their progress in respective courses
  const students = await Promise.all(
    uniqueStudentIds.map(async (studentId) => {
      const clerkUser = clerkUsers.find((u) => u.id === studentId);

      const email =
        clerkUser?.emailAddresses?.[0]?.emailAddress || "Unknown Email";
      const name = clerkUser
        ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
        : "Unknown User";
      const imageUrl = clerkUser?.imageUrl || "";

      // Find which courses this student is enrolled in (from the teacher's courses)
      const enrolledCourses = courses.filter((c) =>
        c.purchases.some((p) => p.userId === studentId),
      );

      const enrolledCoursesWithProgress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const progress = await getProgress(studentId, course.id);
          return {
            id: course.id,
            title: course.title,
            progress: progress || 0,
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
        <h1 className="text-2xl font-bold">Your Students</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Enrolled Courses
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No students have enrolled in your courses yet.
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {student.imageUrl ? (
                        <img
                          src={student.imageUrl}
                          alt={student.name}
                          className="w-8 h-8 rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                          {student.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {student.courses.map((course) => (
                        <div key={course.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-medium line-clamp-1">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            {course.title}
                          </div>

                          {/* Progress Bar inside cell */}
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 relative overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${course.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-4">
                      {student.courses.map((course) => (
                        <div
                          key={course.id}
                          className="text-xs font-semibold tabular-nums"
                        >
                          {course.progress === 100 ? (
                            <span className="text-emerald-500">Completed</span>
                          ) : (
                            <span className="text-slate-500">
                              {Math.round(course.progress)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
