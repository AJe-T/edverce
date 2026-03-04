"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export const MarketingHeader = () => {
  const { userId } = useAuth();

  return (
    <nav className="marketing-header fixed top-0 [.has-topbar_&]:top-10 w-full z-50 bg-[#0f172a99] backdrop-blur-md border-b-0 border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Image
            src="/Logo.png"
            alt="EdVerce Logo"
            width={140}
            height={45}
            className="object-contain"
            priority
          />
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
