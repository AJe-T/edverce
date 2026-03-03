"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Search,
  CalendarRange,
  Rocket,
  ChevronDown,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
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
      <MarketingHeader />

      <div className="animate-fade-in pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 relative">
        {/* Background Glowing Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full transform-gpu filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full transform-gpu filter blur-[120px] pointer-events-none" />

        {/* --- Contact Hero & Form Section --- */}
        <section className="max-w-7xl mx-auto mb-32">
          <div
            className="mb-16 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out forwards" }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-blue-500 leading-[1.1] tracking-tight mb-6">
              Contact us
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Share your requirements and we will help you set up the right LMS
              workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Contact Information Cards */}
            <div
              className="space-y-6 reveal-on-scroll opacity-0 translate-y-10 delay-100"
              style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
            >
              <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8 relative overflow-hidden group">
                {/* Subtle hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Email</h4>
                    <a
                      href="mailto:support@lmsplatform.com"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      support@lmsplatform.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Phone</h4>
                    <a
                      href="tel:+919876543210"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Office</h4>
                    <p className="text-slate-400">Hyderabad, India</p>
                  </div>
                </div>
              </div>

              {/* Support Window Highlight Box */}
              <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 bg-blue-900/10 flex items-start gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-1 relative z-10">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Support window
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Mon-Sat, 10:00 AM to 7:00 PM IST. Priority support for
                    active cohorts.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div
              className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 reveal-on-scroll opacity-0 translate-y-10 delay-200"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Organization"
                    className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you need..."
                    className="w-full bg-[#060B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  Send message
                </button>
                <p className="text-xs text-slate-500 text-center pt-2">
                  This demo form is static. Integrate your email service to
                  enable submissions.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* --- How We Work With Teams (Upgraded to Glassmorphism Grid) --- */}
        <section className="max-w-7xl mx-auto mb-20">
          <h2
            className="text-3xl font-bold text-white mb-8 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
          >
            How we work with teams
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 group"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                  Step 01
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Requirement discovery
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                We map your learning goals, audience, and delivery constraints.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 delay-100 group"
              style={{ animation: "fade-in 1s ease-out 0.3s forwards" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
                  Step 02
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <CalendarRange className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Solution plan
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                You get an implementation roadmap with rollout priorities.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 delay-200 group"
              style={{ animation: "fade-in 1s ease-out 0.4s forwards" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                  Step 03
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Launch support
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Our team helps you ship your first end-to-end academy flow.
              </p>
            </div>
          </div>
        </section>

        {/* --- Common Questions (Accordion) --- */}
        <section className="max-w-3xl mx-auto pb-12">
          <div
            className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Got Questions?
            </h2>
            <p className="text-slate-400 text-lg">
              Everything you need to know about the platform.
            </p>
          </div>

          <div
            className="space-y-4 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
          >
            {[
              {
                q: "Is this platform beginner friendly?",
                a: "Yes. Our courses are structured from fundamental concepts to advanced modules with clear, step-by-step progression.",
              },
              {
                q: "Are the classes live or recorded?",
                a: "We offer a hybrid model. The core concepts are high-quality recorded videos so you can learn at your own pace, paired with weekly live doubt-clearing sessions.",
              },
              {
                q: "Do you provide a certificate?",
                a: "Yes, upon successfully completing all modules and final projects, you receive a verified certificate that you can add to your LinkedIn profile.",
              },
              {
                q: "Can teams use it for internal training?",
                a: "Yes. The platform supports private team learning and role-based access.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className={`glass-panel border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === i ? "border-blue-500/30 bg-blue-900/10" : "hover:border-white/20"}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="text-white font-medium text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === i ? "rotate-180 text-blue-400" : ""}`}
                  />
                </button>
                <div
                  className={`px-6 text-slate-400 transition-all duration-300 overflow-hidden ${activeFaq === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <MarketingFooter />
    </div>
  );
}
