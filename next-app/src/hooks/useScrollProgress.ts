"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Story-driven scroll progress indicator
 * Shows visual progress through the landing page journey
 */
export function useScrollProgress() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const progressBar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (!progressBar) return;

    const ctx = gsap.context(() => {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);
}
