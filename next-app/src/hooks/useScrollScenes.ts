"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useScrollScenes() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sections = gsap.utils.toArray<HTMLElement>(".section");

    if (prefersReducedMotion) {
      // Skip animations for reduced motion
      sections.forEach((section) => {
        const steps = section.querySelectorAll<HTMLElement>("[data-step]");
        gsap.set(steps, { autoAlpha: 1, y: 0 });
      });
      return;
    }

    sections.forEach((section) => {
      const steps = section.querySelectorAll<HTMLElement>("[data-step]");
      
      if (steps.length === 0) return;

      // Set initial state - hidden and slightly below
      gsap.set(steps, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%", // Pin for one full viewport scroll
          scrub: true,
          pin: true,
          anticipatePin: 1,
          markers: false,
        },
      });

      // Reveal each step sequentially
      steps.forEach((el, i) => {
        tl.to(
          el,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          i * 0.5 // Stagger timing
        );
      });

      // Small hold at the end before unpinning
      tl.to({}, { duration: 0.2 });
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
