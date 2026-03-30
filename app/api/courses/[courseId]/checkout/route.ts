import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { calculateCourseCheckoutAmounts } from "@/lib/course-pricing";
import { db } from "@/lib/db";
import { createPhonePePayment, getPhonePeRedirectUrl } from "@/lib/phonepe";
import { findActivePurchase } from "@/lib/purchases";
import { quoteCoupon } from "@/lib/coupons";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const user = await currentUser();
    const body = (await req.json().catch(() => ({}))) as {
      couponCode?: string;
    };

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

    const purchase = await findActivePurchase({
      userId: user.id,
      courseId: params.courseId,
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const originalAmountInPaise = Math.round(course.price * 100);
    const couponQuote = await quoteCoupon(
      originalAmountInPaise,
      body?.couponCode,
    );
    const pricing = calculateCourseCheckoutAmounts({
      baseAmountInPaise: originalAmountInPaise,
      discountInPaise: couponQuote.discountInPaise,
    });
    const amountInPaise = pricing.totalAmountInPaise;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const shortCourseId = course.id.replace(/[^a-zA-Z0-9]/g, "").slice(-12);
    const timePart = Date.now().toString(36);
    const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    const merchantOrderId = `CRS_${shortCourseId}_${timePart}_${randomPart}`;
    const callbackUrl = `${appUrl}/api/courses/${course.id}/purchase?merchantOrderId=${encodeURIComponent(
      merchantOrderId,
    )}`;

    const phonePeOrder = await createPhonePePayment({
      merchantOrderId,
      amount: amountInPaise,
      redirectUrl: callbackUrl,
      courseId: course.id,
      userId: user.id,
      couponCode: body?.couponCode,
    });
    const redirectUrl = getPhonePeRedirectUrl(phonePeOrder);

    if (!redirectUrl) {
      throw new Error(
        `PhonePe checkout URL missing. state=${phonePeOrder.state || "UNKNOWN"} code=${phonePeOrder.code || "NA"} message=${phonePeOrder.message || "NA"}`,
      );
    }

    return NextResponse.json({
      amount: amountInPaise,
      originalAmount: originalAmountInPaise,
      discountAmount: couponQuote.discountInPaise,
      subtotalAmount: pricing.subtotalInPaise,
      gstAmount: pricing.gstInPaise,
      couponCode: couponQuote.couponCode,
      currency: "INR",
      merchantOrderId,
      phonePeOrderId: phonePeOrder.orderId,
      state: phonePeOrder.state,
      redirectUrl,
      courseTitle: course.title,
      userName: user.firstName || user.username || "Learner",
      userEmail: user.emailAddresses?.[0]?.emailAddress || "",
    });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to initialize PhonePe checkout";

    return NextResponse.json({ message }, { status: 500 });
  }
}
