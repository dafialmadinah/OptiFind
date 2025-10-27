"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Story-driven navbar animations
 * Changes navbar style based on scroll position
 */
export function useStoryNavbar() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const navbar = document.querySelector<HTMLElement>("[data-story-navbar]");
    if (!navbar) return;

    const ctx = gsap.context(() => {
      // Navbar background on scroll - always visible
      ScrollTrigger.create({
        trigger: "[data-hero]",
        start: "bottom top",
        end: "bottom top",
        onEnter: () => {
          gsap.to(navbar, {
            backgroundColor: "rgba(242, 245, 255, 0.98)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
            duration: 0.4,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(navbar, {
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.4,
            ease: "power2.out",
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);
}
