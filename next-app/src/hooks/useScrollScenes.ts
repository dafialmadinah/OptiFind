"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const formatNumber = (value: number, formatter: Intl.NumberFormat) => formatter.format(Math.round(value));

export function useScrollScenes() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = gsap.utils.toArray<HTMLElement>(".section");
    const formatter = new Intl.NumberFormat("id-ID");

    if (prefersReducedMotion) {
      sections.forEach((section) => {
        const steps = section.querySelectorAll<HTMLElement>("[data-step]");
        gsap.set(steps, { autoAlpha: 1, y: 0 });

        section.querySelectorAll<HTMLElement>("[data-counter]").forEach((counter) => {
          const target = Number(counter.dataset.to ?? "0");
          const suffix = counter.dataset.suffix ?? "";
          counter.textContent = `${formatNumber(target, formatter)}${suffix}`;
        });
      });
      return;
    }

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
        const scene = section.dataset.scene ?? "";

        if (steps.length > 0) {
          gsap.set(steps, { autoAlpha: 0, y: 24 });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            markers: false,
          },
        });

        switch (scene) {
          case "hero": {
            if (steps.length < 4) {
              break;
            }
            const [headline, subHeadline, primaryCta, secondaryCta] = steps;
            const heroVisual = steps[4];

            timeline.to(headline, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
            timeline.to(subHeadline, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, ">+=0.35");
            timeline.to(primaryCta, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, ">+=0.35");
            timeline.to(secondaryCta, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, ">+=0.35");

            if (heroVisual) {
              gsap.set(heroVisual, { autoAlpha: 1, y: 20 });
              timeline.fromTo(
                heroVisual,
                { autoAlpha: 1, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
                ">+=0.3"
              );
            }

            timeline.to({}, { duration: 0.2 });
            break;
          }

          case "how": {
            if (steps.length < 3) {
              break;
            }
            gsap.set(steps, { autoAlpha: 0, x: 0, y: 0 });
            timeline
              .from(steps[0], { x: 40, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0)
              .from(steps[1], { x: 40, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, "+=0.35")
              .from(steps[2], { x: 40, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, "+=0.35")
              .to({}, { duration: 0.2 });
            break;
          }

          case "impact": {
            if (steps.length < 2) {
              break;
            }
            const counters = Array.from(section.querySelectorAll<HTMLElement>("[data-counter]"));

            timeline.to(steps[0], { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
            timeline.to(steps[1], { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, ">+=0.4");

            counters.forEach((counter, index) => {
              const target = Number(counter.dataset.to ?? "0");
              const suffix = counter.dataset.suffix ?? "";
              const counterState = { value: 0 };

              timeline.to(
                counterState,
                {
                  value: target,
                  duration: 0.8,
                  ease: "power1.out",
                  onUpdate: () => {
                    counter.textContent = `${formatNumber(counterState.value, formatter)}${suffix}`;
                  },
                  onStart: () => {
                    counter.textContent = "0";
                  },
                },
                index === 0 ? ">+=0.4" : "+=0.4"
              );
            });

            timeline.to({}, { duration: 0.2 });
            break;
          }

          case "testimonials": {
            if (steps.length === 0) {
              break;
            }
            const [panel, ...cards] = steps;
            gsap.set(panel, { autoAlpha: 0, y: -80 });
            gsap.set(cards, { autoAlpha: 0, y: 40 });

            timeline.to(panel, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0);

            cards.forEach((card, index) => {
              timeline.to(
                card,
                { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
                index === 0 ? ">+=0.3" : ">+=0.2"
              );
            });

            timeline.to({}, { duration: 0.2 });
            timeline.to(panel, { y: -120, autoAlpha: 0.6, duration: 0.6, ease: "power2.inOut" }, "+=0.3");
            break;
          }

          default: {
            steps.forEach((step, index) => {
              timeline.to(
                step,
                { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
                index === 0 ? 0 : ">+=0.35"
              );
            });
            timeline.to({}, { duration: 0.2 });
          }
        }
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
    };
  }, []);
}
