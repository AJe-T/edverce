import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { RequestLoadingProvider } from "@/components/providers/request-loading-provider";
import { GlobalLoader } from "@/components/global-loader";
import { CursorProvider } from "@/components/providers/cursor-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LMS Platform",
  description: "Modern LMS for creators and learners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.variable}>
          <script
            dangerouslySetInnerHTML={{
              __html: `(() => {
                const saved = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const dark = saved ? saved === "dark" : prefersDark;
                document.documentElement.classList.toggle("dark", dark);
              })();`,
            }}
          />
          <ConfettiProvider />
          <CursorProvider />
          <ToastProvider />
          <RequestLoadingProvider />
          <GlobalLoader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
