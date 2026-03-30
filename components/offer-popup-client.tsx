"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const OfferPopupClient = ({ setting }: { setting: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const isMarketingPage =
    !pathname?.includes("/dashboard") &&
    !pathname?.includes("/teacher") &&
    !pathname?.includes("/courses");

  useEffect(() => {
    if (setting?.popupIsActive && setting?.popupImageUrl && isMarketingPage) {
      const timer = setTimeout(() => {
        const closed = sessionStorage.getItem("offer-popup-closed");
        if (!closed) setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [setting, isMarketingPage]);

  if (!isVisible) return null;

  const handleClose = () => {
    sessionStorage.setItem("offer-popup-closed", "true");
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative max-w-2xl w-full bg-transparent rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer"
        >
          <svg
            className="w-4 h-4"
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
        <div className="relative w-full max-h-[85vh] aspect-video">
          <Image
            src={setting.popupImageUrl}
            alt="Special Offer"
            fill
            className="object-contain rounded-2xl"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};
