import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#03060C] font-sans selection:bg-blue-500/30 text-slate-300">
      <MarketingHeader />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 filter blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-sm tracking-tight">
            Advanced Refund Policy
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
              Introduction
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-2">
              This Privacy Policy describes how Edverce Private Limited
              (&quot;Company&quot;, &quot;Edverce&quot;, &quot;We&quot;,
              &quot;Us&quot;) collects, processes, stores, and protects personal
              data in compliance with the Digital Personal Data Protection Act,
              2023 (India), IT Act 2000, and applicable global standards
              including GDPR principles where relevant.
            </p>
            <p className="text-slate-400 leading-relaxed text-lg">
              By accessing our website or services, you consent to the practices
              described herein.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">2.</span>{" "}
              Data We Collect
            </h2>
            <ul className="space-y-4 text-slate-400 leading-relaxed text-lg">
              <li>
                <strong className="text-white">Personal Information:</strong>{" "}
                Name, email, phone number, billing address, educational details,
                and account credentials.
              </li>
              <li>
                <strong className="text-white">Financial Information:</strong>{" "}
                Payment transaction details processed securely via third-party
                payment gateways (e.g., Razorpay, Stripe). We do not store full
                card details.
              </li>
              <li>
                <strong className="text-white">Technical Data:</strong> IP
                address, browser type, device ID, cookies, usage logs.
              </li>
              <li>
                <strong className="text-white">Communication Data:</strong>{" "}
                Emails, chat messages, support queries.
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">3.</span>{" "}
              Purpose of Processing
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>To provide educational services and course access.</li>
              <li>To process payments and generate invoices.</li>
              <li>To comply with legal, tax, and regulatory obligations.</li>
              <li>To detect fraud, unauthorized access, and abuse.</li>
              <li>To improve platform performance and user experience.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">4.</span>{" "}
              Legal Basis for Processing
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>Consent of the user.</li>
              <li>Performance of contract.</li>
              <li>Compliance with legal obligations.</li>
              <li>Legitimate business interests.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">5.</span>{" "}
              Data Sharing & International Transfers
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>
                We may share data with cloud hosting providers, payment
                processors, analytics providers, and regulatory authorities.
              </li>
              <li>
                If data is transferred outside India, adequate safeguards are
                implemented.
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">6.</span>{" "}
              Data Security Measures
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>
                We implement encryption, secure servers, access controls, and
                periodic security reviews.
              </li>
              <li>Despite best efforts, no system is 100% secure.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">7.</span>{" "}
              Data Retention
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Data is retained as long as required for contractual, legal, and
              tax compliance purposes.
            </p>
          </section>

          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">8.</span>{" "}
              User Rights
            </h2>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed text-lg space-y-2 marker:text-blue-500 pl-2">
              <li>
                Right to access, correction, erasure, grievance redressal, and
                withdrawal of consent.
              </li>
              <li>
                Requests may be sent to{" "}
                <a
                  href="mailto:support@edverce.com"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline decoration-blue-500/30 underline-offset-4"
                >
                  support@edverce.com
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="group pt-4 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors flex items-center gap-3">
              <span className="text-blue-500/50 text-3xl font-light">9.</span>{" "}
              Grievance Officer
            </h2>
            <div className="text-slate-400 leading-relaxed text-lg space-y-1">
              <p>
                <strong className="text-white font-medium">
                  Grievance Contact:
                </strong>{" "}
                <a
                  href="mailto:support@edverce.com"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline decoration-blue-500/30 underline-offset-4"
                >
                  support@edverce.com
                </a>
              </p>
              <p>Edverce Private Limited, India.</p>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
