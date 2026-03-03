import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { couponId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupon = await db.coupon.findUnique({
      where: {
        id: params.couponId,
        userId: userId,
      },
    });

    if (!coupon) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedCoupon = await db.coupon.delete({
      where: {
        id: params.couponId,
      },
    });

    return NextResponse.json(deletedCoupon);
  } catch (error) {
    console.log("[COUPON_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { couponId: string } },
) {
  try {
    const { userId } = auth();
    const { code, discountPercentage, fromDate, toDate, categoryId, limit } =
      await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupon = await db.coupon.update({
      where: {
        id: params.couponId,
        userId: userId,
      },
      data: {
        code: code.toUpperCase(),
        discountPercentage: parseFloat(discountPercentage),
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        categoryId: categoryId || null,
        limit:
          limit !== undefined
            ? limit
              ? parseInt(limit, 10)
              : null
            : undefined,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.log("[COUPON_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
