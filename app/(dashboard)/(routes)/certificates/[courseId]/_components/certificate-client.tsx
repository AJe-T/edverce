"use client";

import { Share2, Download, Medal, GraduationCap } from "lucide-react";

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
  const handlePrint = () => {
    window.print();
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
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between mb-8 print-hidden glass-panel p-4 rounded-2xl border border-white/5 shadow-lg relative z-20">
        <div className="text-slate-300 font-medium mb-4 sm:mb-0">
          Certificate ID:{" "}
          <span className="text-white font-mono">{certData.certificateId}</span>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
            <Share2 className="w-4 h-4" /> Share on LinkedIn
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* The Printable Certificate Container */}
      <div className="w-full max-w-5xl aspect-auto sm:aspect-[1.414/1] bg-[#0A0F1C] relative border border-slate-800 p-2 sm:p-6 rounded-none sm:rounded-sm shadow-2xl certificate-print-container overflow-hidden">
        {/* Certificate Inner Border & Background styling */}
        <div className="w-full h-full border-2 border-blue-500/20 bg-[#060B14] relative p-8 sm:p-16 flex flex-col items-center justify-center text-center">
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
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 shadow-[0_0_15px_rgba(37,99,235,0.6)] rounded-xl flex items-center justify-center bg-blue-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                LMS<span className="text-blue-500">Platform</span>
              </span>
            </div>

            <h3 className="text-blue-500 uppercase tracking-[0.3em] font-bold text-sm sm:text-base mb-6">
              Certificate of Completion
            </h3>

            <p className="text-slate-400 text-lg mb-6 italic">
              This is to certify that
            </p>

            <h1 className="text-4xl sm:text-6xl font-serif text-white font-bold mb-6 tracking-wide drop-shadow-md">
              {certData.studentName}
            </h1>

            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-6">
              has successfully completed all requirements, projects, and
              assessments for the flagship program:
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-blue-100 mb-16">
              {certData.courseName}
            </h2>

            {/* Bottom Section: Signatures & Seal */}
            <div className="w-full flex flex-col sm:flex-row items-end justify-between px-8 sm:px-16 mt-auto">
              {/* Date */}
              <div className="flex flex-col items-center mb-8 sm:mb-0">
                <span className="text-white font-medium text-lg border-b border-white/20 pb-2 mb-2 px-8">
                  {certData.issueDate}
                </span>
                <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">
                  Date Issued
                </span>
              </div>

              {/* Seal/Badge */}
              <div className="relative flex items-center justify-center mb-8 sm:mb-0 mx-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[20px] transform-gpu"></div>
                <div className="w-24 h-24 rounded-full border-2 border-blue-500/50 bg-[#0A0F1C] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                  <Medal className="w-10 h-10 text-blue-500" />
                </div>
              </div>

              {/* Signature */}
              <div className="flex flex-col items-center">
                {/* Simulated Signature Font */}
                <span
                  style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
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
  );
};
