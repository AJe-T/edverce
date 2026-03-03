import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="animate-fade-in min-h-screen pt-28 pb-20 flex items-center justify-center px-6 relative z-10 w-full">
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full transform-gpu filter blur-[120px] pointer-events-none animate-blob" />

      <div className="relative z-10 w-full flex justify-center">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#2563EB",
              colorBackground: "transparent",
              colorText: "#fff",
              colorTextSecondary: "#94a3b8",
              colorInputBackground: "#060B14",
              colorInputText: "#fff",
              colorDanger: "#ef4444",
            },
            elements: {
              card: "glass-panel p-8 md:p-10 rounded-3xl border border-white/5 w-full max-w-md shadow-2xl",
              headerTitle: "text-2xl font-bold text-white text-center",
              headerSubtitle: "text-slate-400 text-sm text-center",
              socialButtonsBlockButton:
                "w-full flex items-center justify-center gap-3 bg-[#0A0F1C] border border-white/10 hover:bg-white/5 text-white font-medium py-3 rounded-xl transition-all",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-500 text-sm",
              formFieldLabel: "text-slate-300 text-sm font-medium",
              formFieldInput:
                "w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all",
              formButtonPrimary:
                "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] mt-2",
              footerActionText: "text-slate-400 text-sm",
              footerActionLink:
                "text-blue-400 hover:text-blue-300 font-semibold transition-colors",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-blue-400",
              formResendCodeLink: "text-blue-400",
            },
          }}
        />
      </div>
    </div>
  );
}
