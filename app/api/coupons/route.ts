import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const { code, discountPercentage, fromDate, toDate, categoryId, limit } =
      await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const uppercaseCode = code.toUpperCase();

    const existingCoupon = await db.coupon.findUnique({
      where: {
        code: uppercaseCode,
      },
    });

    if (existingCoupon) {
      return new NextResponse("Coupon code already exists", { status: 400 });
    }

    const lastModifiedBy = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";

    const coupon = await db.coupon.create({
      data: {
        userId,
        code: uppercaseCode,
        discountPercentage: parseFloat(discountPercentage),
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        categoryId: categoryId || null,
        limit: limit ? parseInt(limit, 10) : null,
        lastModifiedBy,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.log("[COUPONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.log("[COUPONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

