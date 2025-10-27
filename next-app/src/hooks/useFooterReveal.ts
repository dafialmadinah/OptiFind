"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useFooterReveal(defaultFooterH = 420) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = document.querySelector<HTMLElement>("#testimoni");
    const cover = section?.querySelector<HTMLElement>(".cover");
    const footer = document.querySelector<HTMLElement>("[data-footer-underlay]");
    
    if (!section || !cover || !footer) return;

    // Clean up existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === section) st.kill();
    });

    const measure = () => {
      // ukur tinggi footer aktual
      const h = footer.getBoundingClientRect().height || defaultFooterH;
      return Math.max(200, Math.round(h)); // guard minimal
    };
    
    let footerH = measure();

    // update tinggi bila viewport berubah
    const ro = new ResizeObserver(() => { 
      footerH = measure(); 
      ScrollTrigger.refresh(); 
    });
    ro.observe(footer);

    if (reduce) return () => ro.disconnect();

    // Pin testimonials dan scrub setinggi footerH
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + footerH, // jarak scroll = tinggi footer
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      }
    });

    // Geser cover naik PERSIS setinggi footer, bukan -100vh
    tl.to(cover, { 
      y: () => -footerH, 
      ease: "none" 
    });

    return () => { 
      ro.disconnect(); 
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [defaultFooterH]);
}