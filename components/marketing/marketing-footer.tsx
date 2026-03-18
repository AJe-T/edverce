import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github } from "lucide-react";

export const MarketingFooter = () => {
  return (
    <footer className="border-t border-white/5 bg-[#03060C] text-slate-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6 cursor-pointer">
            <Link href="/">
              <Image
                src="/Logo.png"
                alt="EdVerce Logo"
                width={140}
                height={45}
                className="object-contain"
              />
            </Link>
          </div>
          <p className="text-slate-400 max-w-sm mb-6">
            A modern learning management system for creators, schools, and
            communities. Build, publish, and scale learning with confidence.
          </p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/teja-n"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
            Pages
          </h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li>
              <Link
                href="/about"
                className="hover:text-blue-400 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="hover:text-blue-400 transition-colors"
              >
                Programs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
            Legal
          </h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li>
              <Link
                href="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/policy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/refund"
                className="hover:text-blue-400 transition-colors"
              >
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} EdVerce. All rights reserved.
      </div>
    </footer>
  );
};
