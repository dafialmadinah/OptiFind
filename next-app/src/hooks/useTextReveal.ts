"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Professional text reveal animation
 * Characters/words animate in with stagger effect
 */
export function useTextReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const textElements = gsap.utils.toArray<HTMLElement>("[data-text-reveal]");
    if (textElements.length === 0) return;

    const ctx = gsap.context(() => {
      textElements.forEach((element) => {
        // Split text into words/characters
        const text = element.textContent || "";
        const words = text.split(" ");
        
        // Clear and rebuild with spans
        element.innerHTML = words
          .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block word-reveal">${word}</span></span>`)
          .join(" ");

        const wordElements = element.querySelectorAll<HTMLElement>(".word-reveal");

        // Set initial state
        gsap.set(wordElements, {
          yPercent: 100,
          opacity: 0,
        });

        // Animate on scroll
        gsap.to(wordElements, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);
}
