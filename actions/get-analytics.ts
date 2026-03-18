import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings: {
      [courseTitle: string]: { total: number; sales: number };
    } = {};
    const last30DaysMap = new Map<string, number>();

    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      last30DaysMap.set(dateKey, 0);
    }

    const uniqueStudentIds = new Set<string>();

    purchases.forEach((purchase) => {
      uniqueStudentIds.add(purchase.userId);
      const courseTitle = purchase.course.title;

      if (!groupedEarnings[courseTitle]) {
        groupedEarnings[courseTitle] = { total: 0, sales: 0 };
      }

      const price = purchase.course.price || 0;
      groupedEarnings[courseTitle].total += price;
      groupedEarnings[courseTitle].sales += 1;

      const dateKey = purchase.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (last30DaysMap.has(dateKey)) {
        last30DaysMap.set(dateKey, last30DaysMap.get(dateKey)! + price);
      }
    });

    const data = Object.entries(groupedEarnings)
      .map(([courseTitle, stats]) => ({
        name: courseTitle,
        total: stats.total,
        sales: stats.sales,
      }))
      .sort((a, b) => b.total - a.total);

    const dailyData = Array.from(last30DaysMap.entries()).map(
      ([date, total]) => ({
        name: date,
        total: total,
      }),
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;
    const totalStudents = uniqueStudentIds.size;

    return {
      data,
      dailyData,
      totalRevenue,
      totalSales,
      totalStudents,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      dailyData: [],
      totalRevenue: 0,
      totalSales: 0,
      totalStudents: 0,
    };
  }
};
