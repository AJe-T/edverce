import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { PenTool } from "lucide-react";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { SignatureForm } from "./_components/signature-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const SignaturesPage = async () => {
  const { userId } = auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <PenTool className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">Signatures</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SignatureForm courses={courses} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Course Signatures</h2>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};
export default SignaturesPage;
