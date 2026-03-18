import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#03060C] font-sans selection:bg-blue-500/30 text-slate-300">
      <MarketingHeader />

      <div className="relative pt-20 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 filter blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-sm tracking-tight">
            Advanced Terms & Conditions
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
              Acceptance of Terms
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              By accessing or using the services of Edverce Private Limited, you
              agree to these legally binding Terms & Conditions.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">2.</span>{" "}
              Services Description
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-2">
              Edverce provides online educational courses, digital content, live
              sessions, and certification programs.
            </p>
            <p className="text-slate-400 leading-relaxed text-lg">
              We reserve the right to modify or discontinue services without
              prior notice.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">3.</span>{" "}
              User Accounts
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>
                Users are responsible for maintaining confidentiality of login
                credentials.
              </li>
              <li>Sharing accounts is strictly prohibited.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">4.</span>{" "}
              Payments & Billing
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>All payments must be made in full before service access.</li>
              <li>Payments are processed via secure third-party gateways.</li>
              <li>Prices are subject to change without prior notice.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">5.</span>{" "}
              Intellectual Property Rights
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-2">
              All content, trademarks, branding, software, and materials are
              exclusive property of Edverce Private Limited.
            </p>
            <p className="text-slate-400 leading-relaxed text-lg">
              Unauthorized reproduction, distribution, or resale is prohibited.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">6.</span>{" "}
              Limitation of Liability
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>
                Edverce shall not be liable for indirect, incidental, or
                consequential damages.
              </li>
              <li>
                Total liability shall not exceed the amount paid by the user.
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">7.</span>{" "}
              Indemnification
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Users agree to indemnify and hold harmless Edverce against claims
              arising from misuse of services.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">8.</span>{" "}
              Termination
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              We reserve the right to suspend or terminate accounts for
              violation of terms.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">9.</span>{" "}
              Governing Law & Jurisdiction
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>These Terms are governed by the laws of India.</li>
              <li>Jurisdiction shall lie with courts in India.</li>
            </ul>
          </section>

          <section className="group pt-4 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">10.</span>{" "}
              Contact
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              For any queries, please reach out to us at:{" "}
              <a
                href="mailto:support@edverce.com"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline decoration-blue-500/30 underline-offset-4"
              >
                support@edverce.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
