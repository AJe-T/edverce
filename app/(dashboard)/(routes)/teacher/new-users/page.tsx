import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { NewUsersClient } from "./_components/new-users-client";

type Preset = "today" | "week" | "month" | "all";

const getDateRange = (preset: Preset): Date | null => {
  const now = new Date();
  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (preset === "week") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  if (preset === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null; // "all" — no filter
};

const NewUsersPage = async ({
  searchParams,
}: {
  searchParams: { preset?: string };
}) => {
  const { userId } = auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/");
  }

  const preset = (["today", "week", "month", "all"].includes(searchParams.preset || "")
    ? searchParams.preset
    : "month") as Preset;

  const startDate = getDateRange(preset);

  // Fetch ALL purchases across ALL teachers' courses
  const purchases = await db.purchase.findMany({
    where: {
      ...(startDate ? { createdAt: { gte: startDate } } : {}),
    },
    include: {
      course: {
        select: {
          title: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Collect unique user IDs
  const buyerIds = Array.from(new Set(purchases.map((p) => p.userId)));

  // Fetch users from Clerk
  let usersData: Record<string, any> = {};
  if (buyerIds.length > 0) {
    try {
      const usersResponse = await clerkClient.users.getUserList({
        userId: buyerIds,
      });
      usersResponse.forEach((u) => {
        usersData[u.id] = {
          name: u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : "Unknown",
          email: u.emailAddresses?.[0]?.emailAddress || "N/A",
        };
      });
    } catch (error) {
      console.error("[NEW_USERS_CLERK]", error);
    }
  }

  const formattedData = purchases.map((purchase) => {
    const buyer = usersData[purchase.userId] || { name: "Unknown", email: "N/A" };
    return {
      id: purchase.id,
      userId: purchase.userId,
      name: buyer.name,
      email: buyer.email,
      courseTitle: purchase.course.title,
      price: purchase.price ?? purchase.course.price ?? 0,
      couponCode: purchase.couponCode || "None",
      transactionId: purchase.transactionId || "N/A",
      createdAt: purchase.createdAt.toISOString(),
    };
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-full">
          <UserPlus className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold">New Users</h1>
      </div>
      <NewUsersClient data={formattedData} currentPreset={preset} />
    </div>
  );
};

export default NewUsersPage;

