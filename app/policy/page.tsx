import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-primary">Privacy Policy</h1>
        <div className="space-y-6 rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <section>
            <h2 className="text-base font-semibold text-foreground">Information We Collect</h2>
            <p className="mt-2">
              We collect account details, course interaction data, and transaction-related metadata
              required to operate and improve the LMS experience.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">How We Use Data</h2>
            <p className="mt-2">
              Data is used for authentication, access management, analytics, payment validation,
              and support operations.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">Data Security</h2>
            <p className="mt-2">
              We apply standard technical controls to protect user data. Access is restricted
              to authorized systems and personnel.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">User Rights</h2>
            <p className="mt-2">
              Users can request account updates and data-related actions according to applicable laws.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
