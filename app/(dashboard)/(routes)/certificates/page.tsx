import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, Download, CheckCircle, SearchX } from "lucide-react";
import Image from "next/image";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

export default async function CertificatesPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses } = await getDashboardCourses(userId);

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <Award className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">Your Certificates</h1>
      </div>

      {completedCourses.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 border rounded-2xl">
          <SearchX className="h-10 w-10 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-center">
            No certificates yet
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Complete a course step-by-step to earn your official completion
            certificate here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.map((course) => (
            <div
              key={course.id}
              className="group relative bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/10">
                  {/* Decorative certificate background */}
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-tr-full"></div>

                  <div className="relative flex flex-col items-center text-center px-4">
                    <Award className="h-8 w-8 text-yellow-500 mb-2" />
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      Certificate of Completion
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-500 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Awarded for successfully finishing {course.chapters.length}{" "}
                  modules.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Verified
                </div>

                <Link
                  href={`/certificates/${course.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 group/btn"
                >
                  <Download className="h-4 w-4 mr-2 group-hover/btn:-translate-y-0.5 transition-transform" />
                  View Certificate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
