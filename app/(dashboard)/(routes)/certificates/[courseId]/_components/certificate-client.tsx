"use client";

import { Share2, Download, Medal, GraduationCap } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

interface CertificateData {
  studentName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
  instructorName: string;
  instructorRole: string;
}

export const CertificateClient = ({
  certData,
}: {
  certData: CertificateData;
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = async () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement) return;

    try {
      setIsDownloading(true);

      // Temporarily stash old styles to ensure high-quality render
      const originalBorder = certificateElement.style.border;
      certificateElement.style.border = "none";

      const canvas = await html2canvas(certificateElement, {
        scale: 3, // very high resolution
        useCORS: true,
        backgroundColor: "#0A0F1C", // Match dark theme specifically
        logging: false,
      });

      certificateElement.style.border = originalBorder;

      const imgData = canvas.toDataURL("image/png");

      // We'll use landscape A4 size
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Center it strictly vertical if height is smaller
      const yPos = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, yPos > 0 ? yPos : 0, pdfWidth, pdfHeight);
      pdf.save(`${certData.studentName.replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
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
      {/* Action Bar (Hidden in print) */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between mb-8 print-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-md relative z-20">
        <div className="text-slate-600 dark:text-slate-300 font-medium mb-4 sm:mb-0">
          Certificate ID:{" "}
          <span className="text-slate-900 dark:text-white font-mono">
            {certData.certificateId}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Download className="w-4 h-4" />{" "}
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Mobile Wrapper to preserve strict 1024px size */}
      <div className="w-full max-w-[1024px] overflow-x-auto pb-8 -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="min-w-[900px] w-[1024px] max-w-full origin-top-left sm:origin-top transform sm:scale-100">
          {/* The Printable Certificate Container */}
          <div
            ref={certificateRef}
            className="w-full aspect-[1.414/1] bg-[#0A0F1C] relative border border-slate-800 p-6 rounded-sm shadow-2xl certificate-print-container overflow-hidden"
          >
            {/* Certificate Inner Border & Background styling */}
            <div className="w-full h-full border-2 border-blue-500/20 bg-[#060B14] relative p-16 flex flex-col items-center justify-center text-center">
              {/* Decorative Corner Accents */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-blue-500/50"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-blue-500/50"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-blue-500/50"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-blue-500/50"></div>

              {/* Subtle Grid / Watermark Background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

              {/* Glowing Background Blob inside cert */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none transform-gpu"></div>

              {/* Certificate Content */}
              <div className="relative z-10 w-full flex flex-col items-center">
                {/* Header / Logo Logo */}
                <div className="flex items-center justify-center mb-12">
                  <img
                    src="/Logo.png"
                    alt="EdVerce Logo"
                    width="240"
                    style={{ objectFit: "contain", maxHeight: "70px" }}
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

                {/* Bottom Section: Signatures & Seal */}
                <div className="w-full flex flex-row items-end justify-between px-16 mt-auto">
                  {/* Date */}
                  <div className="flex flex-col items-center mb-0">
                    <span className="text-white font-medium text-lg border-b border-white/20 pb-2 mb-2 px-8">
                      {certData.issueDate}
                    </span>
                    <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">
                      Date Issued
                    </span>
                  </div>

                  {/* Seal/Badge */}
                  <div className="relative flex items-center justify-center mb-0 mx-8">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[20px] transform-gpu"></div>
                    <div className="w-24 h-24 rounded-full border-2 border-blue-500/50 bg-[#0A0F1C] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                      <Medal className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="flex flex-col items-center">
                    {/* Simulated Signature Font */}
                    <span
                      style={{
                        fontFamily: "'Brush Script MT', cursive, serif",
                      }}
                      className="text-blue-200 text-4xl border-b border-white/20 pb-2 mb-2 px-8 opacity-90"
                    >
                      {certData.instructorName}
                    </span>
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
