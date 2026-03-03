"use client";

import { useEffect } from "react";

export const CursorProvider = () => {
  useEffect(() => {
    const mediaFinePointer = window.matchMedia("(pointer: fine)");
    const mediaReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!mediaFinePointer.matches || mediaReducedMotion.matches) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    body.classList.add("custom-cursor-enabled");

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";

    const ring = document.createElement("div");
    ring.className = "custom-cursor-ring";

    body.appendChild(cursor);
    body.appendChild(ring);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = 0;

    const setInteractiveState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        root.classList.remove("custom-cursor-hover");
        root.classList.remove("custom-cursor-native");
        return;
      }

      const nativeCursorZones = target.closest(
        "iframe, [data-clerk-portal], [data-clerk-root], [data-localization-key], [data-sonner-toaster]"
      );

      if (nativeCursorZones) {
        root.classList.add("custom-cursor-native");
      } else {
        root.classList.remove("custom-cursor-native");
      }

      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, summary, label, [data-cursor='interactive']"
      );

      if (interactive) {
        root.classList.add("custom-cursor-hover");
      } else {
        root.classList.remove("custom-cursor-hover");
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      setInteractiveState(event.target);
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = window.requestAnimationFrame(animate);
    };

    const onMouseDown = () => root.classList.add("custom-cursor-active");
    const onMouseUp = () => root.classList.remove("custom-cursor-active");
    const onMouseLeave = () => root.classList.add("custom-cursor-hidden");
    const onMouseEnter = () => root.classList.remove("custom-cursor-hidden");

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);

    cursor.style.transform = "translate3d(0px, 0px, 0)";
    ring.style.transform = "translate3d(0px, 0px, 0)";
    rafId = window.requestAnimationFrame(animate);

    return () => {
      body.classList.remove("custom-cursor-enabled");
      root.classList.remove(
        "custom-cursor-hover",
        "custom-cursor-active",
        "custom-cursor-hidden",
        "custom-cursor-native"
      );
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      cursor.remove();
      ring.remove();
    };
  }, []);

  return null;
};
