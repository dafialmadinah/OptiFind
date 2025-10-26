"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useMorphingHowItWorks() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const section = document.querySelector("#cara-kerja") as HTMLElement;
    const cards = gsap.utils.toArray<HTMLElement>("#cara-kerja [data-card]");

    if (!section || cards.length !== 3) return;

    // Add hidden class initially
    section.classList.add("section-hidden");

    if (prefersReducedMotion) {
      // Static layout: show all 3 cards equally
      gsap.set(cards, {
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 33.333%",
        backgroundColor: "#ffffff",
      });
      // Reveal the section
      section.classList.remove("section-hidden");
      return;
    }

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

    // Create main timeline with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=400%", // 4 stages
        scrub: 1.2, // Slightly slower scrub for smoother animation
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
        duration: 1,
        ease: "power2.out",
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
        duration: 1,
        ease: "power2.inOut",
      },
      1
    ).to(
      cards[1],
      {
        x: 0, // Slide dari kanan jauh ke posisi normal
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 58%",
        backgroundColor: "#f48b2f",
        color: "#ffffff",
        duration: 1,
        ease: "power2.out",
      },
      1
    );

    // STAGE 3: Cards 0-1 shrink + white, Terhubung Aman slides from RIGHT
    tl.to(
      cards[0],
      {
        flex: "1 1 31%",
        duration: 1,
        ease: "power2.inOut",
      },
      2
    )
    .to(
      cards[1],
      {
        flex: "1 1 31%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
        duration: 1,
        ease: "power2.inOut",
      },
      2
    )
    .to(
      cards[2],
      {
        x: 0, // Slide dari kanan jauh ke posisi normal
        opacity: 1,
        filter: "blur(0px)",
        flex: "1 1 34%",
        backgroundColor: "#f48b2f",
        color: "#ffffff",
        duration: 1,
        ease: "power2.out",
      },
      2
    );

    // STAGE 4: All cards equal + white
    tl.to(
      cards,
      {
        flex: "1 1 33.333%",
        backgroundColor: "#ffffff",
        color: "#1d1d1d",
        duration: 1,
        ease: "power2.inOut",
      },
      3
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
