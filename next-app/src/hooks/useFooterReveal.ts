"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useFooterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cover = coverRef.current;
    const footer = document.querySelector<HTMLElement>("[data-footer-underlay]");

    if (!section || !cover || !footer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

    if (prefersReducedMotion || isSmallScreen) {
      gsap.set(cover, { y: 0 });
      return;
    }

    const getFooterHeight = () => Math.max(footer.getBoundingClientRect().height, 0);
    let footerHeight = 0;

    const ctx = gsap.context(() => {
      footerHeight = Math.round(getFooterHeight());

      gsap.set(cover, { willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${footerHeight}`,
          scrub: 2, // Slower, smoother scrub matching other sections
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(cover, {
        y: () => -footerHeight,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }, section);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          const nextHeight = Math.round(getFooterHeight());
          if (nextHeight !== footerHeight) {
            footerHeight = nextHeight;
            ScrollTrigger.refresh();
          }
        })
      : null;

    resizeObserver?.observe(footer);

    return () => {
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return { sectionRef, coverRef };
}
