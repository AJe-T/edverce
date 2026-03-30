import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getPhonePeOrderStatus } from "@/lib/phonepe";
import { getPurchaseExpiryDate } from "@/lib/purchases";
import { sendCoursePurchaseEmails } from "@/lib/resend";

const createBrowserRedirectResponse = (targetUrl: URL) => {
  const destination = targetUrl.toString();
  const escapedDestination = destination
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${escapedDestination}" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to dashboard...</p>
    <script>
      (function () {
        var url = ${JSON.stringify(destination)};
        window.location.replace(url);
        if (window.top && window.top !== window) window.top.location.href = url;
        if (window.parent && window.parent !== window) window.parent.location.href = url;
      })();
    </script>
    <noscript>
      <a href="${escapedDestination}">Continue</a>
    </noscript>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Redirect-To": destination,
    },
  });
};

const getMerchantOrderIdFromRequest = async (req: Request) => {
  const requestUrl = new URL(req.url);
  const fromQuery = requestUrl.searchParams.get("merchantOrderId");
  if (fromQuery) return fromQuery;

  if (req.method === "POST") {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await req.json().catch(() => ({}))) as {
        merchantOrderId?: string;
      };
      return body.merchantOrderId || null;
    }

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await req.formData().catch(() => null);
      const fromForm = form?.get("merchantOrderId");
      if (typeof fromForm === "string" && fromForm) {
        return fromForm;
      }
    }
  }

  return null;
};

const handlePurchaseCallback = async (
  req: Request,
  { params }: { params: { courseId: string } },
) => {
  try {
    const requestUrl = new URL(req.url);
    const merchantOrderId = await getMerchantOrderIdFromRequest(req);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
    const statusQuery = new URL(`${appUrl}/dashboard`);

    if (!merchantOrderId) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("reason", "missing_order_id");
      return createBrowserRedirectResponse(statusQuery);
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("reason", "course_not_found");
      return createBrowserRedirectResponse(statusQuery);
    }

    const paymentStatus = await getPhonePeOrderStatus(merchantOrderId);
    const paid =
      paymentStatus.state === "COMPLETED" ||
      paymentStatus.paymentDetails?.some(
        (detail) => detail.state === "COMPLETED",
      ) ||
      false;

    if (!paid) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("state", paymentStatus.state);
      statusQuery.searchParams.set("courseId", params.courseId);
      return createBrowserRedirectResponse(statusQuery);
    }

    if (
      paymentStatus.metaInfo?.udf2 &&
      paymentStatus.metaInfo.udf2 !== params.courseId
    ) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("reason", "course_mismatch");
      statusQuery.searchParams.set("courseId", params.courseId);
      return createBrowserRedirectResponse(statusQuery);
    }

    const paidUserId = paymentStatus.metaInfo?.udf1;
    if (!paidUserId) {
      statusQuery.searchParams.set("payment", "failed");
      statusQuery.searchParams.set("reason", "missing_payment_metadata");
      statusQuery.searchParams.set("courseId", params.courseId);
      return createBrowserRedirectResponse(statusQuery);
    }

    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: paidUserId,
          courseId: params.courseId,
        },
      },
    });

    const purchase = await db.purchase.upsert({
      where: {
        userId_courseId: {
          userId: paidUserId,
          courseId: params.courseId,
        },
      },
      create: {
        courseId: params.courseId,
        userId: paidUserId,
        price: paymentStatus.amount ? (paymentStatus.amount / 100) : course.price,
        couponCode: paymentStatus.metaInfo?.udf3 || null,
        transactionId: merchantOrderId,
      },
      update: {
        createdAt: new Date(),
        price: paymentStatus.amount ? (paymentStatus.amount / 100) : course.price,
        couponCode: paymentStatus.metaInfo?.udf3 || null,
        transactionId: merchantOrderId,
      },
    });

    if (existingPurchase?.transactionId !== merchantOrderId) {
      try {
        const learner = await clerkClient.users.getUser(paidUserId);
        const learnerEmail =
          learner.emailAddresses?.[0]?.emailAddress || "";
        const learnerName =
          `${learner.firstName || ""} ${learner.lastName || ""}`.trim() ||
          learner.username ||
          "Learner";
        const expiryDate = getPurchaseExpiryDate(purchase);

        if (expiryDate) {
          await sendCoursePurchaseEmails({
            learnerName,
            learnerEmail,
            courseTitle: course.title,
            courseId: params.courseId,
            purchasedAt: purchase.createdAt,
            expiryDate,
            amountPaid: purchase.price ?? course.price ?? 0,
            listPrice: course.price ?? 0,
            transactionId: merchantOrderId,
            couponCode: purchase.couponCode,
          });
        }
      } catch (emailError) {
        console.log("[COURSE_ID_PURCHASE_EMAIL]", emailError);
      }
    }

    statusQuery.searchParams.set("payment", "success");
    statusQuery.searchParams.set("courseId", params.courseId);
    return createBrowserRedirectResponse(statusQuery);
  } catch (error) {
    console.log("[COURSE_ID_PURCHASE]", error);
    const requestUrl = new URL(req.url);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
    const statusQuery = new URL(`${appUrl}/dashboard`);
    statusQuery.searchParams.set("payment", "failed");
    statusQuery.searchParams.set("reason", "internal_error");
    statusQuery.searchParams.set("courseId", params.courseId);
    return createBrowserRedirectResponse(statusQuery);
  }
};

export async function GET(
  req: Request,
  ctx: { params: { courseId: string } },
) {
  return handlePurchaseCallback(req, ctx);
}

export async function POST(
  req: Request,
  ctx: { params: { courseId: string } },
) {
  return handlePurchaseCallback(req, ctx);
}
