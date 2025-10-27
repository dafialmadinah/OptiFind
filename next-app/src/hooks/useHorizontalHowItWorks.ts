"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useHorizontalHowItWorks() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = document.querySelector("#cara-kerja") as HTMLElement | null;
    const track = section?.querySelector(".track") as HTMLElement | null;
    const panels = gsap.utils.toArray<HTMLElement>("#cara-kerja .panel");

    if (!section || !track || panels.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(track, { clearProps: "all" });
      Object.assign(track.style, {
        position: "relative",
        display: "block",
        transform: "none",
        width: "100%",
      });

      panels.forEach((panel, index) => {
        gsap.set(panel, { clearProps: "all" });
        Object.assign(panel.style, {
          position: "relative",
          width: "100%",
          opacity: "1",
          filter: "none",
          transform: "none",
          marginTop: index === 0 ? "2rem" : "4rem",
        });
      });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(panels, { opacity: 0.4, filter: "blur(18px)" });

      gsap.to(track, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerWidth * (panels.length - 1),
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerWidth * (panels.length - 1),
          onUpdate: (st) => {
            const progress = st.progress * (panels.length - 1);
            const distance = Math.abs(progress - index);
            const t = Math.max(0, 1 - distance);
            gsap.to(panel, {
              opacity: 0.65 + 0.35 * t,
              filter: `blur(${6 * (1 - t)}px)`,
              duration: 0.2,
              overwrite: "auto",
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);
}
