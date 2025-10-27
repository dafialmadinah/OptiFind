"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useMorphingHowItWorks() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

    const section = document.querySelector("#cara-kerja") as HTMLElement;
    const cards = gsap.utils.toArray<HTMLElement>("#cara-kerja [data-card]");

    if (!section || cards.length !== 3) return;

    const useStaticLayout = prefersReducedMotion || isSmallScreen;

    if (useStaticLayout) {
      // Static layout: show all 3 cards equally
      gsap.set(cards, {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        flex: prefersReducedMotion && !isSmallScreen ? "1 1 33.333%" : "1 1 100%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
      });
      // Reveal the section
      section.classList.remove("section-hidden");
      return;
    }

    // Add hidden class initially
    section.classList.add("section-hidden");

    // INITIAL STATE: All cards collapsed and hidden far to the RIGHT
    gsap.set(cards, {
      opacity: 0,
      x: 800, // Start VERY far to the right (off-screen)
      filter: "blur(10px)",
      flex: "0 0 0%", // Start fully collapsed
      backgroundColor: "#ffffff",
      color: "#1d1d1d",
    });

    // Reveal the section right before creating the timeline
    section.classList.remove("section-hidden");

    // Create main timeline with pinning - smoother scrub and longer duration
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500%", // Longer duration = smoother transitions
        scrub: 3, // Higher scrub = smoother, less choppy
        pin: true,
        anticipatePin: 1,
      },
    });

    // STAGE 1: Laporkan Barang slides in from FAR RIGHT with orange background
    tl.to(
      cards[0],
      {
        x: 0, // Slide dari kanan jauh ke posisi normal
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 90%",
        backgroundColor: "#f48b2f",
        color: "#ffffff",
        duration: 1.5, // Longer duration for smoother animation
        ease: "power2.inOut", // Smoother ease curve
      },
      0
    );

    // STAGE 2: Card 0 shrinks + white, Pencarian Otomatis slides from RIGHT  
    tl.to(
      cards[0],
      {
        flex: "1 1 38%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
        duration: 1.5,
        ease: "power2.inOut",
      },
      1.5
    ).to(
      cards[1],
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 58%",
        backgroundColor: "#f48b2f",
        color: "#ffffff",
        duration: 1.5,
        ease: "power2.inOut",
      },
      1.5
    );

    // STAGE 3: Cards 0-1 shrink + white, Terhubung Aman slides from RIGHT
    tl.to(
      cards[0],
      {
        flex: "1 1 31%",
        duration: 1.5,
        ease: "power2.inOut",
      },
      3
    )
    .to(
      cards[1],
      {
        flex: "1 1 31%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
        duration: 1.5,
        ease: "power2.inOut",
      },
      3
    )
    .to(
      cards[2],
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 34%",
        backgroundColor: "#f48b2f",
        color: "#ffffff",
        duration: 1.5,
        ease: "power2.inOut",
      },
      3
    );

    // STAGE 4: All cards equal + white
    tl.to(
      cards,
      {
        flex: "1 1 33.333%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
        duration: 1.5,
        ease: "power2.inOut",
      },
      4.5
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);
}
