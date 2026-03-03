import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { db } from "@/lib/db";
import { createPhonePePayment } from "@/lib/phonepe";
import { quoteCoupon } from "@/lib/coupons";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const body = (await req.json().catch(() => ({}))) as { couponCode?: string };

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course || !course.price) {
      return new NextResponse("Not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const originalAmountInPaise = Math.round(course.price * 100);
    const couponQuote = quoteCoupon(originalAmountInPaise, body?.couponCode);
    const amountInPaise = couponQuote.finalAmountInPaise;

    // Temporary fallback: if PhonePe credentials are missing, auto-enroll.
    // PhonePe flow remains intact and will be used once credentials are set.
    const hasPhonePeCreds =
      !!process.env.PHONEPE_CLIENT_ID && !!process.env.PHONEPE_CLIENT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    if (!hasPhonePeCreds) {
      await db.purchase.create({
        data: {
          userId: user.id,
          courseId: params.courseId,
        },
      });

      const redirectUrl = `${appUrl}/courses/${params.courseId}?payment=success&mode=bypass`;
      return NextResponse.json({
        amount: amountInPaise,
        originalAmount: originalAmountInPaise,
        discountAmount: couponQuote.discountInPaise,
        couponCode: couponQuote.couponCode,
        currency: "INR",
        state: "COMPLETED",
        redirectUrl,
        courseTitle: course.title,
        userName: user.firstName || user.username || "Learner",
        userEmail: user.emailAddresses?.[0]?.emailAddress || "",
      });
    }

    const merchantOrderId = `COURSE_${course.id}_${Date.now()}_${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)}`;
    const callbackUrl = `${appUrl}/api/courses/${course.id}/purchase?merchantOrderId=${encodeURIComponent(
      merchantOrderId
    )}`;

    const phonePeOrder = await createPhonePePayment({
      merchantOrderId,
      amount: amountInPaise,
      redirectUrl: callbackUrl,
      courseId: course.id,
      userId: user.id,
    });

    return NextResponse.json({
      amount: amountInPaise,
      originalAmount: originalAmountInPaise,
      discountAmount: couponQuote.discountInPaise,
      couponCode: couponQuote.couponCode,
      currency: "INR",
      merchantOrderId,
      phonePeOrderId: phonePeOrder.orderId,
      state: phonePeOrder.state,
      redirectUrl: phonePeOrder.redirectUrl,
      courseTitle: course.title,
      userName: user.firstName || user.username || "Learner",
      userEmail: user.emailAddresses?.[0]?.emailAddress || "",
    });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("PhonePe is not configured", { status: 500 });
  }
}
