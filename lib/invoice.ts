import { COURSE_GST_RATE } from "@/lib/course-pricing";
import { formatPrice } from "@/lib/format";

export const INVOICE_SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL || "support@edverce.com";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const formatInvoiceDate = (value: Date) =>
  value.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getInvoiceNumber = (transactionId: string) =>
  `INV-${transactionId.slice(-10).toUpperCase()}`;

export const getInvoiceBreakdown = ({
  listPriceInRupees,
  totalPaidInRupees,
}: {
  listPriceInRupees: number;
  totalPaidInRupees: number;
}) => {
  const baseAmountInPaise = Math.round(listPriceInRupees * 100);
  const totalPaidInPaise = Math.round(totalPaidInRupees * 100);
  const estimatedSubtotalInPaise = Math.round(
    totalPaidInPaise / (1 + COURSE_GST_RATE),
  );
  const gstInPaise = Math.max(0, totalPaidInPaise - estimatedSubtotalInPaise);
  const discountInPaise = Math.max(
    0,
    baseAmountInPaise - estimatedSubtotalInPaise,
  );

  return {
    listPrice: baseAmountInPaise / 100,
    subtotal: estimatedSubtotalInPaise / 100,
    gst: gstInPaise / 100,
    discount: discountInPaise / 100,
    totalPaid: totalPaidInPaise / 100,
  };
};

export type InvoicePayload = {
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  purchaseDate: Date;
  transactionId: string;
  couponCode?: string | null;
  invoiceNumber: string;
  breakdown: ReturnType<typeof getInvoiceBreakdown>;
};

export const getInvoiceHtml = ({
  learnerName,
  learnerEmail,
  courseTitle,
  purchaseDate,
  transactionId,
  couponCode,
  invoiceNumber,
  breakdown,
}: InvoicePayload) => {
  const rowStyle =
    "padding:12px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;";

  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
        <div style="padding:32px 32px 20px;background:#0f172a;color:#ffffff;">
          <p style="margin:0;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;opacity:0.8;">Invoice</p>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">Payment receipt for your course</h1>
        </div>
        <div style="padding:32px;">
          <div style="display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:24px;">
            <div>
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Billed to</p>
              <p style="margin:0;font-size:15px;font-weight:700;">${escapeHtml(learnerName)}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#475569;">${escapeHtml(learnerEmail)}</p>
            </div>
            <div>
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Invoice details</p>
              <p style="margin:0;font-size:14px;color:#334155;"><strong>Invoice:</strong> ${escapeHtml(invoiceNumber)}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#334155;"><strong>Date:</strong> ${escapeHtml(formatInvoiceDate(purchaseDate))}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#334155;"><strong>Transaction:</strong> ${escapeHtml(transactionId)}</p>
            </div>
          </div>

          <div style="padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="${rowStyle}display:flex;justify-content:space-between;gap:20px;">
              <span>${escapeHtml(courseTitle)}</span>
              <span>${escapeHtml(formatPrice(breakdown.listPrice))}</span>
            </div>
            <div style="${rowStyle}display:flex;justify-content:space-between;gap:20px;">
              <span>Discount${couponCode ? ` (${escapeHtml(couponCode)})` : ""}</span>
              <span>- ${escapeHtml(formatPrice(breakdown.discount))}</span>
            </div>
            <div style="${rowStyle}display:flex;justify-content:space-between;gap:20px;">
              <span>Subtotal</span>
              <span>${escapeHtml(formatPrice(breakdown.subtotal))}</span>
            </div>
            <div style="${rowStyle}display:flex;justify-content:space-between;gap:20px;">
              <span>GST</span>
              <span>${escapeHtml(formatPrice(breakdown.gst))}</span>
            </div>
            <div style="padding-top:16px;display:flex;justify-content:space-between;gap:20px;font-size:16px;font-weight:700;">
              <span>Total paid</span>
              <span>${escapeHtml(formatPrice(breakdown.totalPaid))}</span>
            </div>
          </div>

          <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
            This is a system-generated invoice summary from Edverce. For any billing questions, contact ${escapeHtml(INVOICE_SUPPORT_EMAIL)}.
          </p>
        </div>
      </div>
    </div>
  `;
};
