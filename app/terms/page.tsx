import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-primary">Terms and Conditions</h1>
        <div className="space-y-6 rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <section>
            <h2 className="text-base font-semibold text-foreground">1. Platform Usage</h2>
            <p className="mt-2">
              Users must use this LMS lawfully and responsibly. Unauthorized access attempts, abuse,
              or misuse of course content are strictly prohibited.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">2. Course Ownership</h2>
            <p className="mt-2">
              Educators retain rights to their uploaded learning content. The platform provides hosting,
              access control, and student delivery features.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">3. Purchases and Access</h2>
            <p className="mt-2">
              Paid courses grant learner access as configured by the instructor. Refund and cancellation
              handling should follow your organization policy and local regulations.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">4. Modifications</h2>
            <p className="mt-2">
              Terms may be updated periodically to reflect product and regulatory changes.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
