import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  formatInvoiceDate,
  getInvoiceBreakdown,
  getInvoiceNumber,
  INVOICE_SUPPORT_EMAIL,
} from "@/lib/invoice";
import { InvoiceClient } from "./_components/invoice-client";

const InvoicePage = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams?: { studentId?: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    return redirect("/dashboard");
  }

  const isTeacherView = Boolean(
    searchParams?.studentId && course.userId === userId,
  );
  const targetUserId =
    isTeacherView && searchParams?.studentId ? searchParams.studentId : userId;

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: targetUserId,
        courseId: course.id,
      },
    },
  });

  if (!purchase?.transactionId) {
    return redirect("/dashboard");
  }

  if (!isTeacherView && targetUserId !== userId) {
    return redirect("/dashboard");
  }

  let learnerName = "Learner";
  let learnerEmail = "";

  try {
    const learner = await clerkClient.users.getUser(targetUserId);
    learnerName =
      `${learner.firstName || ""} ${learner.lastName || ""}`.trim() ||
      learner.username ||
      learner.emailAddresses?.[0]?.emailAddress ||
      "Learner";
    learnerEmail = learner.emailAddresses?.[0]?.emailAddress || "";
  } catch {
    return redirect("/dashboard");
  }

  const invoiceData = {
    learnerName,
    learnerEmail,
    courseTitle: course.title,
    purchaseDateLabel: formatInvoiceDate(purchase.createdAt),
    transactionId: purchase.transactionId,
    couponCode: purchase.couponCode,
    invoiceNumber: getInvoiceNumber(purchase.transactionId),
    breakdown: getInvoiceBreakdown({
      listPriceInRupees: course.price ?? purchase.price ?? 0,
      totalPaidInRupees: purchase.price ?? course.price ?? 0,
    }),
    supportEmail: INVOICE_SUPPORT_EMAIL,
  };

  return (
    <div className="min-h-screen">
      <InvoiceClient invoiceData={invoiceData} />
    </div>
  );
};

export default InvoicePage;
