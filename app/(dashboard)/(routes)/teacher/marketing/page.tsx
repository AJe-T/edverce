import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { MarketingForm } from "./_components/marketing-form";

const MarketingPage = async () => {
  const { userId } = auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/");
  }

  const setting = await db.marketingSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <Megaphone className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">Marketing & Popups</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MarketingForm initialData={setting} />
      </div>
    </div>
  );
};
export default MarketingPage;
