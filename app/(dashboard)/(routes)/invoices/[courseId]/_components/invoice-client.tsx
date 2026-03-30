"use client";

import { useEffect, useState } from "react";
import { Download, Receipt } from "lucide-react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

import { formatPrice } from "@/lib/format";

type InvoiceClientProps = {
  invoiceData: {
    learnerName: string;
    learnerEmail: string;
    courseTitle: string;
    purchaseDateLabel: string;
    transactionId: string;
    couponCode?: string | null;
    invoiceNumber: string;
    breakdown: {
      listPrice: number;
      subtotal: number;
      gst: number;
      discount: number;
      totalPaid: number;
    };
    supportEmail: string;
  };
};

const formatPdfMoney = (amount: number) =>
  `INR ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;

const generateInvoicePdf = async (
  invoiceData: InvoiceClientProps["invoiceData"],
  fileName: string,
) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 42, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("Edverce Invoice", margin, 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Payment receipt for course enrollment", margin, 26);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(invoiceData.invoiceNumber, pageWidth - margin, 18, {
    align: "right",
  });
  pdf.setFont("helvetica", "normal");
  pdf.text(invoiceData.purchaseDateLabel, pageWidth - margin, 25, {
    align: "right",
  });

  let y = 56;

  const drawLabelValue = (
    label: string,
    value: string,
    x: number,
    top: number,
    width: number,
  ) => {
    pdf.setTextColor(100, 116, 139);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(label.toUpperCase(), x, top);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(value || "-", width);
    pdf.text(lines, x, top + 7);
    return top + 7 + lines.length * 5;
  };

  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(margin, y, contentWidth / 2 - 4, 34, 4, 4);
  pdf.roundedRect(
    margin + contentWidth / 2 + 4,
    y,
    contentWidth / 2 - 4,
    34,
    4,
    4,
  );

  drawLabelValue(
    "Billed To",
    `${invoiceData.learnerName}\n${invoiceData.learnerEmail}`,
    margin + 4,
    y + 7,
    contentWidth / 2 - 14,
  );
  drawLabelValue(
    "Transaction",
    invoiceData.transactionId,
    margin + contentWidth / 2 + 8,
    y + 7,
    contentWidth / 2 - 18,
  );

  y += 46;

  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, contentWidth, 12, 3, 3, "F");
  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("Description", margin + 4, y + 8);
  pdf.text("Amount", pageWidth - margin - 4, y + 8, { align: "right" });

  y += 20;

  const rows = [
    {
      label: invoiceData.courseTitle,
      value: formatPdfMoney(invoiceData.breakdown.listPrice),
    },
    {
      label: `Discount${invoiceData.couponCode ? ` (${invoiceData.couponCode})` : ""}`,
      value: `- ${formatPdfMoney(invoiceData.breakdown.discount)}`,
    },
    {
      label: "Subtotal",
      value: formatPdfMoney(invoiceData.breakdown.subtotal),
    },
    {
      label: "GST",
      value: formatPdfMoney(invoiceData.breakdown.gst),
    },
  ];

  rows.forEach((row) => {
    const amountColumnWidth = 44;
    const wrappedLabel = pdf.splitTextToSize(
      row.label,
      contentWidth - amountColumnWidth - 14,
    );
    const rowHeight = Math.max(10, wrappedLabel.length * 5 + 2);

    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, y - 4, pageWidth - margin, y - 4);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(wrappedLabel, margin + 4, y);
    pdf.setFont("courier", "bold");
    pdf.text(row.value, pageWidth - margin - 4, y, { align: "right" });
    pdf.setFont("helvetica", "normal");
    y += rowHeight;
  });

  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y - 4, pageWidth - margin, y - 4);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y + 2, contentWidth, 14, 3, 3, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Total Paid", margin + 4, y + 11);
  pdf.setFont("courier", "bold");
  pdf.text(
    formatPdfMoney(invoiceData.breakdown.totalPaid),
    pageWidth - margin - 4,
    y + 11,
    { align: "right" },
  );
  pdf.setFont("helvetica", "normal");

  y += 28;

  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const footer = pdf.splitTextToSize(
    `This is a system-generated invoice summary from Edverce. For billing questions, contact ${invoiceData.supportEmail}.`,
    contentWidth,
  );
  pdf.text(footer, margin, Math.min(y, pageHeight - 20));

  pdf.save(fileName);
};

export const InvoiceClient = ({ invoiceData }: InvoiceClientProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await generateInvoicePdf(
        invoiceData,
        `${invoiceData.invoiceNumber}.pdf`,
      );
    } catch (error) {
      console.error("Error generating invoice PDF", error);
      toast.error("Unable to generate invoice PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (hasAutoDownloaded) return;
    setHasAutoDownloaded(true);

    const autoDownload = async () => {
      try {
        setIsDownloading(true);
        await generateInvoicePdf(
          invoiceData,
          `${invoiceData.invoiceNumber}.pdf`,
        );
      } catch (error) {
        console.error("Error generating invoice PDF", error);
        toast.error("Unable to generate invoice PDF.");
      } finally {
        setIsDownloading(false);
      }
    };

    void autoDownload();
  }, [hasAutoDownloaded, invoiceData]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 px-6 py-12">
      <div className="mx-auto mb-8 flex w-full max-w-4xl items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {invoiceData.invoiceNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            Invoice PDF will download automatically. Use the button if needed.
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Generating..." : "Download Invoice"}
        </button>
      </div>

      <div className="mx-auto w-full max-w-4xl overflow-x-auto">
        <div
          className="mx-auto w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-8 flex items-start justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10">
                <Receipt className="h-6 w-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Invoice
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Payment receipt for course enrollment
              </p>
            </div>

            <div className="text-right text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">
                {invoiceData.invoiceNumber}
              </p>
              <p className="mt-1 text-slate-500">{invoiceData.purchaseDateLabel}</p>
              <p className="mt-1 text-slate-500">
                Transaction: {invoiceData.transactionId}
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Billed To
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {invoiceData.learnerName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {invoiceData.learnerEmail}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Course
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {invoiceData.courseTitle}
              </p>
              {invoiceData.couponCode ? (
                <p className="mt-1 text-sm text-slate-500">
                  Coupon applied: {invoiceData.couponCode}
                </p>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-[1fr_auto] gap-4 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800/50">
              <span>Description</span>
              <span>Amount</span>
            </div>

            {[
              {
                label: invoiceData.courseTitle,
                value: formatPrice(invoiceData.breakdown.listPrice),
              },
              {
                label: `Discount${invoiceData.couponCode ? ` (${invoiceData.couponCode})` : ""}`,
                value: `- ${formatPrice(invoiceData.breakdown.discount)}`,
              },
              {
                label: "Subtotal",
                value: formatPrice(invoiceData.breakdown.subtotal),
              },
              {
                label: "GST",
                value: formatPrice(invoiceData.breakdown.gst),
              },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}

            <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-slate-200 bg-slate-50 px-5 py-5 text-base font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white">
              <span>Total Paid</span>
              <span>{formatPrice(invoiceData.breakdown.totalPaid)}</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            This is a system-generated invoice summary from Edverce. For billing
            questions, contact {invoiceData.supportEmail}.
          </p>
        </div>
      </div>
    </div>
  );
};
