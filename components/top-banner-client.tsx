"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const TopBannerClient = ({ setting }: { setting: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const staticPages = ["/"];
  const isStaticPage = staticPages.includes(pathname);

  useEffect(() => {
    if (setting?.popupIsActive && setting?.popupTitle && isStaticPage) {
      const closed = sessionStorage.getItem("topbar-closed");
      if (!closed) {
        setIsVisible(true);
        document.body.classList.add("has-topbar");
      } else {
        setIsVisible(false);
        document.body.classList.remove("has-topbar");
      }
    } else {
      setIsVisible(false);
      document.body.classList.remove("has-topbar");
    }

    return () => {
      document.body.classList.remove("has-topbar");
    };
  }, [setting, isStaticPage]);

  if (!isVisible) return null;

  const handleClose = () => {
    sessionStorage.setItem("topbar-closed", "true");
    setIsVisible(false);
    document.body.classList.remove("has-topbar");
  };

  return (
    <div className="w-full bg-slate-900 border-b border-indigo-500/20 text-slate-100 fixed top-0 left-0 right-0 z-[99999] overflow-hidden">
      <div className="max-w-[100vw] overflow-hidden flex items-center relative h-10 px-8">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                transition: padding-top 300ms cubic-bezier(0.4, 0, 0.2, 1);
              }
              body.has-topbar {
                padding-top: 40px;
              }
              @keyframes marquee {
                from { transform: translateX(100vw); }
                to { transform: translateX(-100%); }
              }
              .animate-marquee {
                display: inline-block;
                white-space: nowrap;
                animation: marquee 40s linear infinite;
                will-change: transform;
              }
            `,
          }}
        />
        <div className="animate-marquee font-medium text-xs tracking-widest uppercase">
          <span className="mx-10">{setting.popupTitle}</span>
          <span className="mx-10">{setting.popupTitle}</span>
          <span className="mx-10">{setting.popupTitle}</span>
          <span className="mx-10">{setting.popupTitle}</span>
        </div>

        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-900 w-16 pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute right-4 p-1 text-slate-400 hover:text-white transition z-10 cursor-pointer"
        >
          <svg
            className="w-[14px] h-[14px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
