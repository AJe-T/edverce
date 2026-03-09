import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { MessageSquare } from "lucide-react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function QueriesPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const queries = await db.contactQuery.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <MessageSquare className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">User Queries</h1>
      </div>
      <DataTable columns={columns} data={queries} />
    </div>
  );
}
