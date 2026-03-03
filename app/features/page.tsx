import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  Shield,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const features = [
  {
    icon: LayoutDashboard,
    title: "Teacher workspace",
    description: "Create courses, manage chapters, and publish content in a guided workflow.",
  },
  {
    icon: Video,
    title: "YouTube lesson delivery",
    description: "Use YouTube links for lectures while keeping chapter-level structure and progress tracking.",
  },
  {
    icon: BookOpen,
    title: "Learning paths",
    description: "Organize topics into structured chapters that improve retention and completion.",
  },
  {
    icon: Users,
    title: "Student experience",
    description: "Clear navigation, purchase-based access control, and a clean reading + watching interface.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Understand sales and engagement trends with practical instructor dashboards.",
  },
  {
    icon: Shield,
    title: "Reliable platform controls",
    description: "Authentication, protected routes, and publish states built into core flows.",
  },
];

export default function FeaturesPage() {
  const pillars = [
    "Roadmap-based course structure",
    "Sectioned lessons with collapsible navigation",
    "Coupon-ready checkout and payment flow",
    "Progress analytics for learners and instructors",
  ];

  const stackPhases = [
    {
      title: "Create",
      description: "Draft modules, chapters, and section metadata in teacher mode.",
    },
    {
      title: "Monetize",
      description: "Run paid enrollments with discount-aware checkout.",
    },
    {
      title: "Deliver",
      description: "Guide learners through sectioned sidebars and chapter progression.",
    },
    {
      title: "Optimize",
      description: "Track completion and cohort performance with analytics.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12">
        <section className="max-w-3xl reveal-up">
          <h1 className="text-4xl font-semibold tracking-tight text-primary">Platform features</h1>
          <p className="mt-4 text-muted-foreground">
            Everything needed to run a modern learning platform with cohort-style flow, structure, and completion focus.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-xl border bg-card p-5 shadow-sm tilt-3d">
                <div className="mb-3 inline-flex rounded-md bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border bg-card p-6 parallax-strip">
          <h2 className="text-2xl font-semibold tracking-tight">Built around real learner outcomes</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {pillars.map((item) => (
              <div key={item} className="rounded-lg border bg-background p-3 text-sm text-muted-foreground tilt-3d">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Engine Architecture</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Product flow is divided into a clear lifecycle so teams can ship fast without breaking learner experience.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {stackPhases.map((phase, index) => (
              <div key={phase.title} className="relative rounded-xl border bg-background p-4 tilt-3d">
                <span className="text-xs text-primary font-semibold">0{index + 1}</span>
                <h3 className="mt-2 font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-secondary/10 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Motion-first experience</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-background p-4 pulse-glow">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Animated transitions for sections, pricing cards, and roadmap milestones.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-4 float-soft">
              <BarChart3 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Visual data blocks for completions, engagement, and chapter depth.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-4 float-soft-delay">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Modular layout designed for long-scroll storytelling pages.
              </p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
