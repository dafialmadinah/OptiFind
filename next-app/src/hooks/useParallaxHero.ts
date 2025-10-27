"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Professional parallax effect for hero section
 * Creates depth with multi-layer movement
 */
export function useParallaxHero() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    const ctx = gsap.context(() => {
      // Parallax layers
      const visual = hero.querySelector<HTMLElement>("[data-hero-visual]");
      const content = hero.querySelector<HTMLElement>("[data-hero-content]");
      const gradient = hero.querySelector<HTMLElement>("[data-hero-gradient]");

      // Multi-layer parallax with different speeds
      if (visual) {
        gsap.to(visual, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });

        // Rotation on scroll for extra depth
        gsap.to(visual.querySelector("img"), {
          rotation: 8,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      if (content) {
        gsap.to(content, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // Gradient background shift
      if (gradient) {
        gsap.to(gradient, {
          yPercent: 50,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // Fade out hero on scroll
      gsap.to(hero, {
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);
}
