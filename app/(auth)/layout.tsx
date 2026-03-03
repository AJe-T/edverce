export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060B14] w-full text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex items-center justify-center relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glass-panel {
          background: rgba(15, 23, 42, 0.6) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

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
      {children}
    </div>
  );
}
