import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: { couponId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupon = await db.coupon.findUnique({
      where: {
        id: params.couponId,
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
    const user = await currentUser();
    const userId = user?.id;
    const { code, discountPercentage, fromDate, toDate, categoryId, limit } =
      await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastModifiedBy = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";

    const coupon = await db.coupon.update({
      where: {
        id: params.couponId,
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
        lastModifiedBy,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.log("[COUPON_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

