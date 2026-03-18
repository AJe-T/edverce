import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060B14] font-sans selection:bg-blue-500/30 overflow-hidden pt-40 pb-20 flex flex-col items-center justify-center px-6 relative text-center z-10">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `,
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full transform-gpu filter blur-[150px] pointer-events-none animate-blob" />

      <div className="relative z-10 animate-fade-in">
        <h1 className="text-8xl md:text-[150px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-6 drop-shadow-2xl leading-none">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          You&apos;ve strayed off the roadmap
        </h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track to your learning goals.
        </p>

        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
