"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth section-to-section transitions with scale and opacity
 * Creates cinematic story flow between sections
 */
export function useSectionTransitions() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const sections = gsap.utils.toArray<HTMLElement>(".section");
    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        // Scale up and fade in when entering
        gsap.fromTo(
          section,
          {
            scale: 0.9,
            opacity: 0.7,
          },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              scrub: 2,
            },
          }
        );

        // Scale down and fade out when leaving (except last section)
        if (index < sections.length - 1) {
          gsap.to(section, {
            scale: 0.95,
            opacity: 0.5,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: "bottom 40%",
              end: "bottom top",
              scrub: 2,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);
}
