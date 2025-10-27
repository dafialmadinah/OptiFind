"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useImpactCountUp() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const section = document.querySelector<HTMLElement>("#dampak");
    if (!section) return;

    const steps = section.querySelectorAll<HTMLElement>("[data-step]");
    const counters = section.querySelectorAll<HTMLElement>("[data-counter]");
    const bgElement = section.querySelector<HTMLElement>("[data-impact-bg]");
    const shouldPin = !reduce && !isSmallScreen;

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === section) st.kill();
    });

    // Reduced motion: no pin, show instantly
    if (reduce) {
      if (bgElement) {
        gsap.set(bgElement, { yPercent: 0 });
      }
      steps.forEach(el => el.style.opacity = "1");
      counters.forEach(el => {
        const to = Number(el.getAttribute("data-to") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        el.textContent = new Intl.NumberFormat("en-US").format(to) + suffix;
      });
      return;
    }

    // Set initial states
    gsap.set(steps, { autoAlpha: 0, y: 24 });
    gsap.set(counters, { textContent: "0" });
    
    // Set initial state for icon circles - slide from right
    const iconCircles = section.querySelectorAll<HTMLElement>(".stats-icon-circle");
    gsap.set(iconCircles, { x: 100, autoAlpha: 0 });
    
    // Set initial state for background - position above viewport (outside screen)
    if (bgElement) {
      gsap.set(bgElement, { yPercent: -140 });
    }

    // Create pinned timeline for section structure ONLY
    if (shouldPin) {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 2, // Slower, smoother scrub matching other sections
        pin: true,
        anticipatePin: 1,
      });
    }

    // Add background parallax effect during scroll
    if (bgElement) {
      gsap.to(bgElement, {
        backgroundPosition: "50% 40%",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    // Background slide in from top (from outside viewport - like falling from sky)
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      onEnter: () => {
        if (bgElement) {
          gsap.to(bgElement, {
            yPercent: 0,
            duration: 1.4,
            ease: "power2.out" // Smoother ease
          });
        }
      },
      onLeaveBack: () => {
        if (bgElement) {
          gsap.to(bgElement, {
            yPercent: -140,
            duration: 0.8,
            ease: "power2.in" // Smoother ease
          });
        }
      }
    });

    // Title & paragraph reveal when section enters with stagger
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        gsap.to(steps, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out", // Smoother ease
          stagger: 0.12, // Slightly faster stagger for smoother flow
          delay: 0.2
        });
        
        // Animate icon circles sliding in from right
        gsap.to(iconCircles, {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out", // Smoother ease
          stagger: 0.08, // Faster stagger
          delay: 0.5
        });
      },
      onLeaveBack: () => {
        gsap.to(steps, {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: "power2.in", // Smoother ease
          stagger: 0.1
        });
        
        // Reset icon circles when scrolling back
        gsap.to(iconCircles, {
          x: 100,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.in", // Smoother ease
          stagger: 0.1
        });
      }
    });

    // Counter animations - start when section is in view (ONCE ONLY)
    let counterAnimated = false; // Flag to ensure animation runs only once
    
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      onEnter: () => {
        if (counterAnimated) return; // Skip if already animated
        counterAnimated = true; // Set flag
        
        counters.forEach((el, i) => {
          const to = Number(el.getAttribute("data-to") || "0");
          const suffix = el.getAttribute("data-suffix") || "";
          const obj = { val: 0 };

          gsap.to(obj, {
            val: to,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.5 + (i * 0.2),
            onUpdate: () => {
              const v = Math.floor(obj.val);
              el.textContent = new Intl.NumberFormat("en-US").format(v) + suffix;
            }
          });
        });
      },
      // Remove onLeaveBack to prevent reset when scrolling back
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);
}
