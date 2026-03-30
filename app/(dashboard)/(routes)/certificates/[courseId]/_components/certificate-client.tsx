"use client";

import { Download, Medal } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

interface CertificateData {
  studentName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
  instructorName: string;
  instructorSignature: string;
  instructorSignatureUrl?: string | null;
  instructorRole: string;
}

export const CertificateClient = ({
  certData,
  courseId,
  enforceDownloadLimit,
  remainingDownloads,
  supportEmail,
}: {
  certData: CertificateData;
  courseId: string;
  enforceDownloadLimit: boolean;
  remainingDownloads: number;
  supportEmail: string;
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadsLeft, setDownloadsLeft] = useState(remainingDownloads);

  const handlePrint = async () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement) return;

    if (enforceDownloadLimit && downloadsLeft <= 0) {
      toast.error(
        `You have used all 5 certificate downloads. Please contact ${supportEmail} for access.`,
      );
      return;
    }

    try {
      setIsDownloading(true);

      let updatedDownloadsLeft = downloadsLeft;

      if (enforceDownloadLimit) {
        const response = await axios.post(
          `/api/certificates/${courseId}/download`,
        );
        updatedDownloadsLeft = response.data.remainingDownloads;
        setDownloadsLeft(updatedDownloadsLeft);
      }

      const originalBorder = certificateElement.style.border;
      certificateElement.style.border = "none";

      const canvas = await html2canvas(certificateElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#0A0F1C", 
        logging: false,
      });

      certificateElement.style.border = originalBorder;

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const yPos = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, Math.max(0, yPos), pdfWidth, pdfHeight);
      pdf.save(`${certData.studentName.replaceAll(/\s+/g, "_")}_Certificate.pdf`);
      if (enforceDownloadLimit) {
        toast.success(
          updatedDownloadsLeft > 0
            ? `${updatedDownloadsLeft} certificate downloads remaining`
            : "This was your last certificate download",
        );
      }
    } catch (error) {
      console.error("Error generating PDF", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to download certificate right now.",
        );
      } else {
        toast.error("Unable to generate certificate PDF.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in min-h-screen pt-12 pb-20 flex flex-col items-center px-6 relative z-10 w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            background-color: transparent !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden {
            display: none !important;
          }
          .certificate-print-container {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            page-break-after: avoid;
            page-break-before: avoid;
          }
        }
      `,
        }}
      />
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between mb-8 print-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-md relative z-20">
        <div className="text-slate-600 dark:text-slate-300 font-medium mb-4 sm:mb-0 space-y-1">
          <div>
            Certificate ID:{" "}
            <span className="text-slate-900 dark:text-white font-mono">
              {certData.certificateId}
            </span>
          </div>
          {enforceDownloadLimit ? (
            downloadsLeft > 0 ? (
              <p className="text-xs text-muted-foreground">
                You can download this certificate {downloadsLeft} more{" "}
                {downloadsLeft === 1 ? "time" : "times"}.
              </p>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Download limit reached. Contact {supportEmail} to get download
                access again.
              </p>
            )
          ) : null}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            disabled={isDownloading || (enforceDownloadLimit && downloadsLeft <= 0)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Download className="w-4 h-4" />{" "}
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1024px] overflow-x-auto pb-8 -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="min-w-[900px] w-[1024px] max-w-full origin-top-left sm:origin-top transform sm:scale-100">
          <div
            ref={certificateRef}
            className="w-full aspect-[1.414/1] bg-[#0A0F1C] relative border border-slate-800 p-6 rounded-sm shadow-2xl certificate-print-container overflow-hidden"
          >
            <div className="w-full h-full border-2 border-blue-500/20 bg-[#060B14] relative p-16 flex flex-col items-center justify-center text-center">
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-blue-500/50"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-blue-500/50"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-blue-500/50"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-blue-500/50"></div>

              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none transform-gpu"></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="flex items-center justify-center mb-12">
                  <Image
                    src="/Logo.png"
                    alt="EdVerce Logo"
                    width={240}
                    height={70}
                    style={{ objectFit: "contain", maxHeight: "70px" }}
                    unoptimized
                  />
                </div>

                <h3 className="text-blue-500 uppercase tracking-[0.3em] font-bold text-base mb-6">
                  Certificate of Completion
                </h3>

                <p className="text-slate-400 text-lg mb-6 italic">
                  This is to certify that
                </p>

                <h1 className="text-6xl font-serif text-white font-bold mb-6 tracking-wide drop-shadow-md">
                  {certData.studentName}
                </h1>

                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-6">
                  has successfully completed all requirements, projects, and
                  assessments for the flagship program:
                </p>

                <h2 className="text-3xl font-bold text-blue-100 mb-16">
                  {certData.courseName}
                </h2>

                <div className="w-full flex flex-row items-end justify-between px-16 mt-auto">
                  <div className="flex flex-col items-center mb-0">
                    <span className="text-white font-medium text-lg border-b border-white/20 pb-2 mb-2 px-8">
                      {certData.issueDate}
                    </span>
                    <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">
                      Date Issued
                    </span>
                  </div>

                  <div className="relative flex items-center justify-center mb-0 mx-8">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[20px] transform-gpu"></div>
                    <div className="w-24 h-24 rounded-full border-2 border-blue-500/50 bg-[#0A0F1C] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                      <Medal className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {certData.instructorSignatureUrl ? (
                      <div className="relative w-40 h-14 border-b border-white/20 pb-2 mb-2 px-8">
                        <Image
                          src={certData.instructorSignatureUrl}
                          alt="Instructor Signature"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Brush Script MT', cursive, serif",
                        }}
                        className="text-blue-200 text-4xl border-b border-white/20 pb-2 mb-2 px-8 opacity-90"
                      >
                        {certData.instructorSignature}
                      </span>
                    )}
                    <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">
                      {certData.instructorRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
