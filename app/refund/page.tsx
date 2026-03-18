import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#03060C] font-sans selection:bg-blue-500/30 text-slate-300">
      <MarketingHeader />

      <div className="relative pt-20 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 filter blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-sm tracking-tight">
            Advanced Refund & Cancellation Policy
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Edverce Private Limited
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="space-y-12 bg-[#0f172a66] backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl">
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">1.</span>{" "}
              General Policy
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-2">
              Due to the digital nature of educational services, fees are
              generally non-refundable once course access is granted.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">2.</span>{" "}
              Eligibility for Refund
            </h2>
            <p>
              Refund requests must be submitted within 7 days of purchase and
              before substantial course consumption.
            </p>
            <p>
              Live course cancellations prior to commencement may qualify for
              partial refunds.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">3.</span>{" "}
              Non-Refundable Circumstances
            </h2>
            <p>Change of mind.</p>
            <p>Failure to attend live sessions.</p>
            <p>Violation of Terms & Conditions.</p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">4.</span>{" "}
              Duplicate or Failed Transactions
            </h2>
            <p>Duplicate payments will be refunded within 7-10 working days.</p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">5.</span>{" "}
              Refund Processing
            </h2>
            <p>
              Approved refunds will be credited to the original payment method
              within 7-14 working days.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">6.</span>{" "}
              Chargebacks
            </h2>
            <p>
              Users initiating unjustified chargebacks may have their accounts
              suspended.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">7.</span>{" "}
              Contact
            </h2>
            <p>Refund requests: support@edverce.com</p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
