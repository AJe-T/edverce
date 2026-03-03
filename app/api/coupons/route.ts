import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { code, discountPercentage, fromDate, toDate, categoryId, limit } =
      await req.json();

    if (!userId) {
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

    const coupon = await db.coupon.create({
      data: {
        userId,
        code: uppercaseCode,
        discountPercentage: parseFloat(discountPercentage),
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        categoryId: categoryId || null,
        limit: limit ? parseInt(limit, 10) : null,
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      where: {
        userId,
      },
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
