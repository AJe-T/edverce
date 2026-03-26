"use client";
import Link from "next/link";
import Image from "next/image";

import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import {
  Play,
  Star,
  Layout,
  Users,
  CheckCircle,
  ChevronDown,
  Award,
  ArrowRight,
  MessageSquare,
  Terminal,
  Cloud,
  Database,
  Heart,
  Server,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const FadeIn = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: any) => {
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, type: "spring", bounce: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const reviewsRow1 = [
  {
    name: "Akhil Sharma",
    role: "Frontend Engineer",
    text: "The section-based learning path made it easy to stay consistent. I moved from scattered docs to building real apps in weeks. The mentor feedback is unmatched.",
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Sarah Jenkins",
    role: "Full Stack Developer",
    text: "This platform gave me the structured learning I desperately needed. The projects are actually relevant to modern industry standards. Highly recommend!",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    text: "I was struggling with React for months before joining. The interactive coding environments and clear video explanations made everything click for me.",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "David Kim",
    role: "Student",
    text: "The community features are amazing. Being able to ask questions and get answers from both mentors and peers within minutes is a game-changer.",
    color: "from-pink-500 to-rose-500",
  },
];

const reviewsRow2 = [
  {
    name: "Priya Patel",
    role: "SDE-1 @ Amazon",
    text: "I was stuck in tutorial hell for a year. This platform gave me the roadmap I needed. I recently cracked my first SDE role and I owe it to the DSA path here.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "James Wilson",
    role: "Backend Developer",
    text: "The deeply technical deep dives into Node.js and systems architecture blew me away. It goes way beyond basic CRUD apps. Incredible value.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Elena Rodriguez",
    role: "UX/UI Designer -> Dev",
    text: "Transitioning from design to development was intimidating, but the CSS and Tailwind modules here bridge the gap perfectly. I'm building what I design now!",
    color: "from-fuchsia-500 to-purple-500",
  },
  {
    name: "Rahul Verma",
    role: "Tech Lead",
    text: "I recommend this to all the juniors I mentor. It's the only platform out there that truly focuses on writing clean, scalable, and professional code.",
    color: "from-amber-500 to-orange-500",
  },
];

const scrollingRow1 = [...reviewsRow1, ...reviewsRow1, ...reviewsRow1];
const scrollingRow2 = [...reviewsRow2, ...reviewsRow2, ...reviewsRow2];

const FaqSection = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqData = [
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
      a: "Absolutely. We have specialized plans for startups and enterprises with team dashboards to track progress.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-24 px-6 max-w-3xl mx-auto border-t border-white/5"
    >
      <FadeIn className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Got Questions?
        </h2>
        <p className="text-slate-400 text-lg">
          Everything you need to know about the platform.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {faqData.map((faq, i) => (
          <FadeIn delay={i * 0.1} key={i}>
            <div
              className={`glass-panel border rounded-2xl overflow-hidden transition-colors duration-300 ${activeFaq === i ? "border-blue-500/50 bg-blue-900/10" : "border-white/5 hover:border-white/20"}`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className="text-white font-medium text-lg">{faq.q}</span>
                <motion.div
                  animate={{ rotate: activeFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown
                    className={`w-5 h-5 ${activeFaq === i ? "text-blue-400" : "text-slate-400"}`}
                  />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 text-slate-400 overflow-hidden"
                  >
                    <div className="pb-5">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default function App() {
  const heroX = useMotionValue(0);
  const heroY = useMotionValue(0);
  const mouseXSpring = useSpring(heroX, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(heroY, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleHeroMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    heroX.set(xPct);
    heroY.set(yPct);
  };

  const handleHeroMouseLeave = () => {
    heroX.set(0);
    heroY.set(0);
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-300 font-sans overflow-hidden selection:bg-blue-500/30">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 40s linear infinite; width: max-content; will-change: transform; transform: translateZ(0); }
        .animate-scroll:hover { animation-play-state: paused; }
        
        @keyframes scroll-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-scroll-reverse { animation: scroll-reverse 40s linear infinite; width: max-content; will-change: transform; transform: translateZ(0); }
        .animate-scroll-reverse:hover { animation-play-state: paused; }

        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .timeline-line { background: linear-gradient(to bottom, transparent, #3b82f6 15%, #3b82f6 85%, transparent); }
      `,
        }}
      />

      <MarketingHeader />

      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full transform-gpu filter blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full transform-gpu filter blur-[100px]"
        />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                New Cohort Starting Soon
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Master tech skills that{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                  actually
                </span>{" "}
                get you hired.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Stop watching disjointed tutorials. Build roadmap-style
                programs, run premium cohorts, and ship production-ready
                applications from day one.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.4}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="#courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
                >
                  Explore Programs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 rounded-full font-bold text-lg text-white border border-white/10 flex items-center justify-center gap-2 glass-panel"
                >
                  <Layout className="w-5 h-5 flex-shrink-0" />
                  Dashboard
                </motion.button>
              </Link>
            </FadeIn>

            <FadeIn
              delay={0.5}
              className="pt-8 flex items-center gap-8 border-t border-white/5"
            >
              <div>
                <div className="text-3xl font-bold text-white">120k+</div>
                <div className="text-sm text-slate-500 mt-1">
                  Learner sessions
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">92%</div>
                <div className="text-sm text-slate-500 mt-1">
                  Completion rate
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center hidden lg:flex perspective-[1000px]">
            <motion.div
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-[500px] h-[350px] rounded-2xl glass-panel border border-white/10 shadow-2xl z-10 p-6 flex flex-col"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transform: "translateZ(50px)" }}
                className="absolute -top-6 -right-6 glass-panel p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Module Passed
                  </div>
                  <div className="text-xs text-slate-400">+500 XP</div>
                </div>
              </motion.div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div
                className="flex-1 bg-[#0A0F1C] rounded-xl border border-white/5 p-4 flex flex-col gap-4 relative overflow-hidden"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="h-4 w-32 bg-slate-800 rounded"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-blue-900/40 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
                </div>

                <div className="absolute bottom-4 right-4 w-40 h-24 bg-slate-800 rounded-lg border border-white/10 overflow-hidden group">
                  <Image
                    src="/hero-section-1.avif"
                    alt="Code"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-[500px] h-[500px] border border-white/5 rounded-full"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] border border-blue-500/10 rounded-full border-dashed"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-white/5 bg-slate-900/20 overflow-hidden flex flex-col items-center mt-12 mb-12">
        <p className="text-sm font-semibold text-slate-500 mb-10 tracking-widest uppercase">
          Master Modern Technologies
        </p>
        <div className="w-full relative flex overflow-x-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#060B14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#060B14] to-transparent z-10 pointer-events-none"></div>

          <div className="animate-scroll flex items-center w-max">
            {[1, 2, 3, 4].map((group) => (
              <div
                key={group}
                className="flex gap-24 items-center pr-24 shrink-0"
              >
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3">
                  <Image src="/html5.svg" width={56} height={56} alt="HTML5" />{" "}
                  HTML5
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3">
                  <Image src="/css.svg" width={56} height={56} alt="CSS3" />{" "}
                  CSS3
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3 text-center">
                  <Image
                    src="/javascript.svg"
                    width={56}
                    height={56}
                    alt="JavaScript"
                  />
                  JavaScript
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3 text-center">
                  <Image
                    src="/mongodb.svg"
                    width={56}
                    height={56}
                    alt="MongoDB"
                  />
                  MongoDB
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3 text-center">
                  <Image
                    src="/typescript.svg"
                    width={56}
                    height={56}
                    alt="TypeScript"
                  />
                  TypeScript
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3 text-center">
                  <Image
                    src="/nodedotjs.svg"
                    width={56}
                    height={56}
                    alt="Node.js"
                  />
                  Node.js
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3">
                  <Image src="/react.svg" width={56} height={56} alt="React" />{" "}
                  React
                </div>
                <div className="text-xl font-bold text-slate-300 flex flex-col items-center gap-3 text-center">
                  <Image
                    src="/tailwindcss.svg"
                    width={56}
                    height={56}
                    alt="Tailwind CSS"
                  />{" "}
                  Tailwind CSS
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-32 px-6 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Flagship Learning Tracks
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Not just scattered tutorials. Structured, deep-dive cohorts designed
            to take you from fundamentals to advanced architecture.
          </p>
        </FadeIn>

        <div className="space-y-12">
          <FadeIn direction="left">
            <div className="group glass-panel rounded-3xl p-2 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-16 border border-white/5 hover:border-blue-500/30 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-transparent transition-all duration-500"></div>

              <div className="w-full md:w-5/12 aspect-video md:aspect-square bg-slate-900 rounded-2xl overflow-hidden relative border border-white/10">
                <Image
                  src="/home-page-img-2.avif"
                  alt="Web Dev"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-xs font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>{" "}
                  Live Classes
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col justify-center px-4 pb-6 md:p-0 relative z-10">
                <div className="flex gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                    Frontend
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                    Backend
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  The Complete Full Stack Web Development Track
                </h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Start from basic HTML/CSS, conquer React, build robust Node.js
                  backend APIs, and master system design. Ship 5
                  production-grade applications.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500" /> 24 Weeks
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500" /> 150+ Hours
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500" /> Mentor
                    Support
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-500" /> Placement
                    Prep
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="self-start bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                        View Curriculum <ArrowRight className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0F1C] border border-white/10 text-slate-300 max-w-2xl overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                          Full Stack Web Development
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <p className="text-slate-400 text-sm">
                          This track is currently under heavy production. Here
                          is a sneak peek at the modules you will master soon:
                        </p>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 1: The Frontend Core
                          </h4>
                          <p className="text-sm">
                            Semantic HTML5, Advanced CSS3 mechanics, CSS
                            Variables, and Flexbox/Grid mastery.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 2: JavaScript & DOM Manipulation
                          </h4>
                          <p className="text-sm">
                            ES6+ syntax, asynchronous programming, closures, and
                            fetching APIs under the hood.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 3: React & Next.js Ecosystem
                          </h4>
                          <p className="text-sm">
                            Server vs Client components, App Router, Hooks,
                            Redux Toolkit, and Tailwind CSS.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 4: Scalable Backend APIs
                          </h4>
                          <p className="text-sm">
                            Node.js, Express, MVC architecture, custom JWT
                            authentication, and security.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 5: MongoDB & PostgreSQL
                          </h4>
                          <p className="text-sm">
                            Prisma ORM, Mongoose, NoSQL vs SQL, robust
                            relational models, and aggregation.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-blue-400">
                            Module 6: Final Capstone Ship
                          </h4>
                          <p className="text-sm">
                            Build a fully featured LMS/E-Commerce platform from
                            scratch and deploy to AWS.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link href="/search">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30">
                      Go to Courses <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="group glass-panel rounded-3xl p-2 md:p-8 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 border border-white/5 hover:border-indigo-500/30 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-indigo-600/0 via-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute inset-0 z-50 backdrop-blur-xl bg-slate-950/70 flex flex-col items-center justify-center pointer-events-none rounded-3xl">
                <div className="bg-black/90 px-8 py-4 rounded-full border border-indigo-500/50 text-indigo-400 text-xl font-bold tracking-widest flex items-center gap-3 shadow-[0_0_40px_rgba(99,102,241,0.6)] pointer-events-auto">
                  <Sparkles className="w-5 h-5" /> COMING SOON
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col justify-center px-4 pb-6 md:p-0 relative z-10">
                <div className="flex gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                    Algorithms
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
                    Interviews
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                  DSA & Interview Prep Path
                </h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Focused modules for Data Structures, Algorithms, frontend
                  architecture, and practical machine coding rounds. Crack top
                  tech companies with confidence.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-500" /> 12 Weeks
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-500" /> 300+
                    Problems
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-500" /> Mock
                    Interviews
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-500" /> Resume
                    Review
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="self-start bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                        View Curriculum <ArrowRight className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0F1C] border border-white/10 text-slate-300 max-w-2xl overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                          DSA & Interview Prep Path
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <p className="text-slate-400 text-sm">
                          We are meticulously handcrafting 300+ problems and
                          video explanations. Content arriving soon:
                        </p>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 1: Time & Space Complexity
                          </h4>
                          <p className="text-sm">
                            Big O notation, asymptotes, and memory models under
                            the hood.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 2: Fundamental Data Structures
                          </h4>
                          <p className="text-sm">
                            Arrays, Strings, Hashmaps, Linked Lists, Stacks, and
                            Queues.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 3: Advanced Architectures
                          </h4>
                          <p className="text-sm">
                            Trees, Graphs, Tries, Disjoint Sets (Union Find),
                            and Segment Trees.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 4: The Algorithm Playbook
                          </h4>
                          <p className="text-sm">
                            Two Pointers, Sliding Window, Deep/Breadth First
                            Search, Dynamic Programming.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 5: Machine Coding Rounds
                          </h4>
                          <p className="text-sm">
                            Build Twitter feed, LRU Cache, and DOM Tree
                            transversal algorithms step by step.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-2 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                          <h4 className="font-bold text-indigo-400">
                            Phase 6: Mock Interviews
                          </h4>
                          <p className="text-sm">
                            Behavioral rounds, resume optimization, and intense
                            1-on-1 mock sessions.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link href="/search">
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                      Go to Courses <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-5/12 aspect-video md:aspect-square bg-slate-900 rounded-2xl overflow-hidden relative border border-white/10">
                <Image
                  src="/home-page-img-2.avif"
                  alt="DSA"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-xs font-bold text-white">
                  Self Paced
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        id="tools"
        className="py-24 px-6 bg-[#03060C] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The tools you&apos;ll master.
            </h2>
            <p className="text-slate-400 text-lg">
              We teach industry-standard tech stacks used by top companies.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[500px]">
            <FadeIn
              direction="up"
              delay={0.1}
              className="md:col-span-2 md:row-span-1 glass-panel rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[60px] group-hover:bg-blue-500/20 transition-colors" />
              <Layout className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Modern Frontend
              </h3>
              <p className="text-slate-400 max-w-md">
                Build buttery-smooth, interactive UI with React, Next.js, Framer
                Motion, and Tailwind CSS. Learn component architecture and state
                management.
              </p>
            </FadeIn>

            <FadeIn
              direction="up"
              delay={0.2}
              className="md:col-span-1 md:row-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group flex flex-col"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-[60px] group-hover:bg-emerald-500/20 transition-colors" />
              <Server className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Scalable Backend
              </h3>
              <p className="text-slate-400 mb-8 flex-1">
                Design robust APIs, handle authentication, and build
                microservices using Node.js, Express, and GraphQL.
              </p>

              <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-sm font-mono text-emerald-300">
                app.post(&apos;/api/users&apos;, <br />{" "}
                &nbsp;&nbsp;authMiddleware,
                <br /> &nbsp;&nbsp;userController
                <br />
                );
              </div>
            </FadeIn>

            <FadeIn
              direction="up"
              delay={0.3}
              className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-[40px]" />
              <Database className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Databases</h3>
              <p className="text-slate-400 text-sm">
                Master both SQL (PostgreSQL) and NoSQL (MongoDB, Redis) for
                optimal data modeling.
              </p>
            </FadeIn>

            <FadeIn
              direction="up"
              delay={0.4}
              className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full filter blur-[40px]" />
              <Cloud className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Cloud & Deployment
              </h3>
              <p className="text-slate-400 text-sm">
                Deploy applications seamlessly using AWS, Docker, and CI/CD
                pipelines.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-[#0A0F1C] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Your Roadmap To Mastery
            </h2>
            <p className="text-slate-400 text-lg">
              A structured journey designed to prevent tutorial hell.
            </p>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 timeline-line transform md:-translate-x-1/2 rounded-full hidden sm:block"></div>

            <FadeIn className="relative flex flex-col md:flex-row items-start justify-between mb-16 md:mb-24 group">
              <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-4 md:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  1. The Foundation
                </h3>
                <p className="text-slate-400">
                  Master core concepts with guided, interactive lessons. We
                  don&apos;t skip the &quot;why&quot; behind the code.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-[#0A0F1C] bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] z-10 transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div className="md:w-[45%] order-1 md:order-2 pl-12 md:pl-0 hidden md:block">
                <div className="glass-panel p-4 rounded-xl border border-white/10 opacity-50 group-hover:opacity-100 transition-opacity">
                  <pre className="text-xs text-blue-300 font-mono">
                    <code>
                      const masterBasics = () ={">"} {"{"} <br />
                      &nbsp;&nbsp;return &quot;Strong Foundation&quot;;
                      <br />
                      {"}"}
                    </code>
                  </pre>
                </div>
              </div>
            </FadeIn>

            <FadeIn className="relative flex flex-col md:flex-row items-start justify-between mb-16 md:mb-24 group">
              <div className="md:w-[45%] order-1 pl-12 md:pl-0 hidden md:flex justify-end">
                <div className="glass-panel p-4 rounded-xl border border-white/10 w-full max-w-xs opacity-50 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <div className="h-2 w-full bg-slate-800 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-2 w-5/6 bg-purple-500/50 rounded"></div>
                </div>
              </div>
              <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-[#0A0F1C] bg-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] z-10 transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div className="md:w-[45%] text-left order-2 pl-12 md:pl-0 mt-4 md:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  2. Build Projects
                </h3>
                <p className="text-slate-400">
                  Apply what you&apos;ve learned. Build real-world applications
                  with mentor-reviewed milestones.
                </p>
              </div>
            </FadeIn>

            <FadeIn className="relative flex flex-col md:flex-row items-start justify-between group">
              <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-4 md:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  3. Interview Prep
                </h3>
                <p className="text-slate-400">
                  Practice system design, problem-solving, and curated interview
                  drills to land your dream job.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-[#0A0F1C] bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div className="md:w-[45%] order-1 md:order-2 pl-12 md:pl-0 hidden md:block">
                <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                  <Award className="text-emerald-400 w-8 h-8" />
                  <div>
                    <div className="text-white font-bold text-sm">
                      Job Ready
                    </div>
                    <div className="text-slate-400 text-xs">
                      Profile Approved
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 items-center reveal-on-scroll opacity-100 translate-y-0">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <Terminal className="w-4 h-4" /> Built-in IDE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Code, test, and ship <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                without leaving the browser.
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Forget about frustrating local environment setups. Our integrated
              code playground gives you an instant, cloud-based IDE to practice
              React, Node.js, Python, and more right inside your lessons.
            </p>
            <ul className="space-y-3 pt-2 pb-4">
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-500" /> Real-time
                preview and console logs
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-500" /> Support for
                15+ languages & frameworks
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-500" /> AI-assisted
                code suggestions
              </li>
            </ul>
            <Link href="/playground">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2">
                Open Playground <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="relative rounded-2xl glass-panel border border-white/10 p-2 shadow-2xl order-1 lg:order-2">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0F1C] rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-slate-500 font-mono bg-white/5 px-3 py-1 rounded-md">
                main.jsx
              </div>
              <div className="flex gap-2">
                <Play className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="bg-[#0A0F1C] p-6 rounded-b-xl font-mono text-sm sm:text-base text-slate-300 overflow-hidden relative min-h-[300px] flex flex-col">
              <pre className="text-left overflow-x-auto">
                <span className="text-pink-400">import</span> React{" "}
                <span className="text-pink-400">from</span>{" "}
                <span className="text-green-400">&apos;react&apos;</span>;<br />
                <br />
                <span className="text-blue-400">
                  export default function
                </span>{" "}
                <span className="text-yellow-300">App</span>() {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-pink-400">return</span> (
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                <span className="text-blue-300">div</span>{" "}
                <span className="text-purple-300">className</span>=
                <span className="text-green-400">
                  &quot;grid place-items-center&quot;
                </span>
                &gt;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
                <span className="text-blue-300">h1</span>{" "}
                <span className="text-purple-300">className</span>=
                <span className="text-green-400">&quot;text-white&quot;</span>
                &gt;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello, Edverce
                Developer!
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                <span className="text-blue-300">h1</span>&gt;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                <span className="text-blue-300">div</span>&gt;
                <br />
                &nbsp;&nbsp;);
                <br />
                {"}"}
              </pre>

              <div className="absolute bottom-4 right-4 left-12 bg-[#060B14] border border-white/10 rounded-lg p-4 shadow-xl transform translate-y-2 hover:translate-y-0 transition-transform">
                <div className="text-xs text-slate-500 mb-2 font-sans border-b border-white/5 pb-2">
                  Preview Output
                </div>
                <div className="grid place-items-center h-16">
                  <h1 className="text-white font-bold text-lg">
                    Hello, Edverce Developer! 👋
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="py-24 px-6 relative overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i,
            }}
            className={`absolute rounded-full filter blur-xl ${i % 2 === 0 ? "bg-blue-600/20" : "bg-purple-600/20"}`}
            style={{
              width: 100 + i * 20,
              height: 100 + i * 20,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Learning is better together.
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Join our private Discord community of over 50,000 active
                developers. Get code reviews, pair program with peers, and
                network with alumni who now work at top tech companies.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 glass-panel p-4 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">
                      24/7 Mentor Support
                    </h4>
                    <p className="text-sm text-slate-400">
                      Stuck on a bug? Get unblocked fast.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 glass-panel p-4 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">
                      Peer Accountability
                    </h4>
                    <p className="text-sm text-slate-400">
                      Weekly standups keep you on track.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn
              direction="right"
              className="relative h-[400px] flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-square border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-3/4 h-3/4 border border-white/5 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border border-blue-500/20 bg-blue-500/5 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                </div>

                {[
                  {
                    icon: (
                      <Image
                        src="/react.svg"
                        width={32}
                        height={32}
                        alt="React"
                      />
                    ),
                  },
                  {
                    icon: (
                      <Image
                        src="/mongodb.svg"
                        width={32}
                        height={32}
                        alt="MongoDB"
                      />
                    ),
                  },
                  {
                    icon: (
                      <Image
                        src="/javascript.svg"
                        width={32}
                        height={32}
                        alt="JavaScript"
                      />
                    ),
                  },
                  {
                    icon: (
                      <Image
                        src="/typescript.svg"
                        width={32}
                        height={32}
                        alt="TypeScript"
                      />
                    ),
                  },
                  {
                    icon: (
                      <Image
                        src="/html5.svg"
                        width={32}
                        height={32}
                        alt="HTML5"
                      />
                    ),
                  },
                  {
                    icon: (
                      <Image
                        src="/github.svg"
                        width={32}
                        height={32}
                        alt="GitHub"
                        className="invert"
                      />
                    ),
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * -3.33,
                    }}
                    className="absolute w-full h-full rounded-full"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 bg-[#0A0F1C] flex items-center justify-center shadow-lg">
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * -3.33,
                        }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        {item.icon}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-24 overflow-hidden bg-slate-900/20 border-y border-white/5 flex flex-col items-center"
      >
        <div className="text-center mb-20 px-6 reveal-on-scroll opacity-100 translate-y-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Learner Stories
          </h2>
          <p className="text-slate-400 text-lg">
            {"Don't just take our word for it."}
          </p>
        </div>

        <div className="w-full relative flex flex-col gap-6 overflow-x-hidden rotate-[-1deg] scale-105">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#060B14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#060B14] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll gap-6 px-4">
            {scrollingRow1.map((item, i) => (
              <div
                key={i}
                className="w-[350px] shrink-0 bg-[#0A0F1C] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors shadow-lg"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  &quot;{item.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.color}`}
                  ></div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {item.name}
                    </div>
                    <div className="text-slate-500 text-xs">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex animate-scroll-reverse gap-6 px-4">
            {scrollingRow2.map((item, i) => (
              <div
                key={i}
                className="w-[350px] shrink-0 bg-[#0A0F1C] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors shadow-lg"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  &quot;{item.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.color}`}
                  ></div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {item.name}
                    </div>
                    <div className="text-slate-500 text-xs">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[1000px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full"></div>
        </div>

        <FadeIn className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to launch your learning roadmap?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who are advancing their careers through
            structured, project-based learning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/search" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all"
              >
                Start Learning Now <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="#courses" className="w-full sm:w-auto">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
              >
                See full syllabus
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </section>

      <MarketingFooter />
    </div>
  );
}
