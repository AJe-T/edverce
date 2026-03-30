import {
  getInvoiceBreakdown,
  getInvoiceHtml,
  getInvoiceNumber,
  INVOICE_SUPPORT_EMAIL,
} from "@/lib/invoice";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getPurchaseConfirmationHtml = ({
  learnerName,
  courseTitle,
  courseUrl,
  purchaseDate,
  expiryDate,
}: {
  learnerName: string;
  courseTitle: string;
  courseUrl: string;
  purchaseDate: Date;
  expiryDate: Date;
}) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
        <div style="padding:32px;background:linear-gradient(135deg,#0f172a,#0891b2);color:#ffffff;">
          <p style="margin:0;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;opacity:0.8;">Edverce</p>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">Your course purchase is confirmed</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin-top:0;font-size:16px;">Hi ${escapeHtml(learnerName)},</p>
          <p style="font-size:15px;line-height:1.7;color:#334155;">
            Thanks for your purchase. You now have access to <strong>${escapeHtml(courseTitle)}</strong>.
          </p>
          <div style="margin:24px 0;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
            <p style="margin:0 0 10px;font-size:14px;color:#475569;"><strong>Purchased on:</strong> ${escapeHtml(formatDate(purchaseDate))}</p>
            <p style="margin:0 0 10px;font-size:14px;color:#475569;"><strong>Access valid until:</strong> ${escapeHtml(formatDate(expiryDate))}</p>
            <p style="margin:0;font-size:14px;color:#475569;"><strong>Course:</strong> ${escapeHtml(courseTitle)}</p>
          </div>
          <a href="${courseUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#0891b2;color:#ffffff;text-decoration:none;font-weight:700;">
            Open your course
          </a>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
            If you need help, reply to this email or contact ${escapeHtml(INVOICE_SUPPORT_EMAIL)}.
          </p>
        </div>
      </div>
    </div>
  `;
};

export const sendCoursePurchaseEmails = async ({
  learnerName,
  learnerEmail,
  courseTitle,
  courseId,
  purchasedAt,
  expiryDate,
  amountPaid,
  listPrice,
  transactionId,
  couponCode,
}: {
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  courseId: string;
  purchasedAt: Date;
  expiryDate: Date;
  amountPaid: number;
  listPrice: number;
  transactionId: string;
  couponCode?: string | null;
}) => {
  if (!resendApiKey || !resendFromEmail) {
    console.log("[RESEND] Skipped email send because RESEND_API_KEY or RESEND_FROM_EMAIL is missing.");
    return;
  }

  if (!learnerEmail) {
    console.log("[RESEND] Skipped email send because learner email is missing.");
    return;
  }

  const courseUrl = `${appUrl}/courses/${courseId}`;
  const invoiceNumber = getInvoiceNumber(transactionId);
  const breakdown = getInvoiceBreakdown({
    listPriceInRupees: listPrice,
    totalPaidInRupees: amountPaid,
  });

  const sendEmail = async ({
    subject,
    html,
    idempotencyKey,
  }: {
    subject: string;
    html: string;
    idempotencyKey: string;
  }) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [learnerEmail],
        subject,
        html,
        reply_to: INVOICE_SUPPORT_EMAIL,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorBody}`);
    }
  };

  const results = await Promise.allSettled([
    sendEmail({
      subject: `Your Edverce course purchase is confirmed: ${courseTitle}`,
      html: getPurchaseConfirmationHtml({
        learnerName,
        courseTitle,
        courseUrl,
        purchaseDate: purchasedAt,
        expiryDate,
      }),
      idempotencyKey: `purchase-${transactionId}`,
    }),
    sendEmail({
      subject: `Invoice for your Edverce order ${invoiceNumber}`,
      html: getInvoiceHtml({
        learnerName,
        learnerEmail,
        courseTitle,
        purchaseDate: purchasedAt,
        transactionId,
        couponCode,
        invoiceNumber,
        breakdown,
      }),
      idempotencyKey: `invoice-${transactionId}`,
    }),
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.log(
        `[RESEND] Failed to send ${index === 0 ? "purchase confirmation" : "invoice"} email`,
        result.reason,
      );
    }
  });
};
