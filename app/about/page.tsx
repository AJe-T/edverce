"use client";

import { useEffect, useRef } from "react";
import {
  BookOpen,
  Map,
  Lightbulb,
  Users,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const useTiltEffect = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);
};

export default function About() {
  const aboutHeroCardRef = useRef(null);
  useTiltEffect(aboutHeroCardRef);

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
        
        .timeline-line { background: linear-gradient(to bottom, transparent, #3b82f6 15%, #3b82f6 85%, transparent); }

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

      <div className="animate-fade-in pt-40 pb-20 lg:pt-48 lg:pb-32 px-6">
        <section className="relative overflow-hidden mb-32">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full transform-gpu filter blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full transform-gpu filter blur-[100px]" />

          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="space-y-6 reveal-on-scroll opacity-0 translate-y-10"
              style={{ animation: "fade-in 1s ease-out forwards" }}
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold text-blue-500 leading-[1.1] tracking-tight mb-8">
                About LMS Platform
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                LMS Platform helps educators and training teams create
                outcome-driven learning programs. We combine a clean authoring
                workflow with learner progress intelligence.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                From onboarding academies to professional certification tracks,
                our platform is designed for reliability, speed, and a
                high-quality learner experience.
              </p>
            </div>

            <div
              className="relative lg:h-[500px] hidden lg:flex items-center justify-center reveal-on-scroll opacity-0 translate-y-10 delay-100"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <div
                ref={aboutHeroCardRef}
                className="relative w-[500px] h-[350px] rounded-2xl glass-panel border border-white/10 shadow-2xl transition-transform duration-200 ease-out z-10 flex items-center justify-center p-12"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="w-full h-full bg-[#0A0F1C] rounded-xl border border-white/5 p-8 flex flex-col justify-center gap-8 relative overflow-hidden"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
                      <div className="w-16 h-2 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-400/40 shadow-[0_0_20px_rgba(96,165,250,0.4)]"></div>
                      <div className="w-16 h-2 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-300/40 shadow-[0_0_20px_rgba(147,197,253,0.4)]"></div>
                      <div className="w-16 h-2 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="absolute w-[450px] h-[450px] border border-blue-500/10 rounded-full border-dashed"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-32">
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 group"
              style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Learner-first execution
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Every section, lesson, and checkpoint is designed to improve
                consistency and completion.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 delay-100 group"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Roadmap over random content
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                We prioritize guided programs so users always know the next
                meaningful step.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors reveal-on-scroll opacity-0 translate-y-10 delay-200 group"
              style={{ animation: "fade-in 1s ease-out 0.3s forwards" }}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Practical by default
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Lessons focus on projects, outcomes, and implementation details
                that translate to work.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-32 relative">
          <div
            className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Our product journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 timeline-line transform md:-translate-x-1/2 rounded-full hidden sm:block"></div>

            <div
              className="reveal-on-scroll opacity-0 translate-y-10 relative flex flex-col md:flex-row items-center justify-between mb-16 group"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-4 md:mt-0">
                <div className="text-blue-500 text-sm font-bold mb-2 uppercase tracking-wider">
                  Phase 1
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Creator workflow
                </h3>
                <p className="text-slate-400">
                  Course authoring, chapters, and publish controls shipped as
                  core rails.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-1/2 transform -translate-y-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#0A0F1C] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10 transition-transform group-hover:scale-125"></div>
              <div className="md:w-[45%] order-1 md:order-2 pl-12 md:pl-0 hidden md:block opacity-0">
                Spacer
              </div>
            </div>

            <div
              className="reveal-on-scroll opacity-0 translate-y-10 relative flex flex-col md:flex-row items-center justify-between mb-16 group"
              style={{ animation: "fade-in 1s ease-out 0.3s forwards" }}
            >
              <div className="md:w-[45%] order-1 pl-12 md:pl-0 hidden md:block opacity-0">
                Spacer
              </div>
              <div className="absolute left-0 md:left-1/2 top-1/2 transform -translate-y-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#0A0F1C] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 transition-transform group-hover:scale-125"></div>
              <div className="md:w-[45%] text-left order-2 pl-12 md:pl-0 mt-4 md:mt-0">
                <div className="text-indigo-400 text-sm font-bold mb-2 uppercase tracking-wider">
                  Phase 2
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Student journey
                </h3>
                <p className="text-slate-400">
                  Access controls, purchase gates, and progress completion loops
                  introduced.
                </p>
              </div>
            </div>

            <div
              className="reveal-on-scroll opacity-0 translate-y-10 relative flex flex-col md:flex-row items-center justify-between group"
              style={{ animation: "fade-in 1s ease-out 0.4s forwards" }}
            >
              <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-4 md:mt-0">
                <div className="text-purple-400 text-sm font-bold mb-2 uppercase tracking-wider">
                  Phase 3
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Cohort readiness
                </h3>
                <p className="text-slate-400">
                  Section-based navigation, pricing breakdowns, and richer
                  onboarding UI.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-1/2 transform -translate-y-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#0A0F1C] bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 transition-transform group-hover:scale-125"></div>
              <div className="md:w-[45%] order-1 md:order-2 pl-12 md:pl-0 hidden md:block opacity-0">
                Spacer
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-10">
          <h2
            className="text-3xl font-bold text-white mb-8 reveal-on-scroll opacity-0 translate-y-10"
            style={{ animation: "fade-in 1s ease-out 0.1s forwards" }}
          >
            What drives us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 reveal-on-scroll opacity-0 translate-y-10"
              style={{ animation: "fade-in 1s ease-out 0.2s forwards" }}
            >
              <Users className="w-8 h-8 text-blue-400 mb-6" />
              <p className="text-slate-300 leading-relaxed">
                Build learning communities where consistency and accountability
                are built into the product.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 reveal-on-scroll opacity-0 translate-y-10 delay-100"
              style={{ animation: "fade-in 1s ease-out 0.3s forwards" }}
            >
              <Rocket className="w-8 h-8 text-blue-400 mb-6" />
              <p className="text-slate-300 leading-relaxed">
                Ship practical updates quickly, grounded in feedback from
                learners and instructors.
              </p>
            </div>

            <div
              className="glass-panel p-8 rounded-2xl border border-white/5 reveal-on-scroll opacity-0 translate-y-10 delay-200"
              style={{ animation: "fade-in 1s ease-out 0.4s forwards" }}
            >
              <ShieldCheck className="w-8 h-8 text-blue-400 mb-6" />
              <p className="text-slate-300 leading-relaxed">
                Keep core learning journeys reliable with stable access controls
                and transparent flows.
              </p>
            </div>
          </div>
        </section>
      </div>

      <MarketingFooter />
    </div>
  );
}
