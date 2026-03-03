"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export const MarketingHeader = () => {
  const { userId } = useAuth();

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#0f172a99] backdrop-blur-md border-b-0 border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 90 }}
            className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all"
          >
            L
          </motion.div>
          <span className="text-xl font-bold text-white tracking-tight">
            LMS<span className="text-blue-500">Platform</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {userId ? (
            <SignOutButton>
              <button className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log out
              </button>
            </SignOutButton>
          ) : (
            <Link href="/sign-in">
              <button className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </button>
            </Link>
          )}
          <Link href="/search">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Start Learning
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
