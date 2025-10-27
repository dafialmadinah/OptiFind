"use client";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Floating elements with parallax on mouse move
 * Creates immersive 3D-like effect
 */
export function useFloatingElements() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const floatingElements = gsap.utils.toArray<HTMLElement>("[data-float]");
    if (floatingElements.length === 0) return;

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const percentX = (e.clientX - centerX) / centerX;
      const percentY = (e.clientY - centerY) / centerY;

      floatingElements.forEach((element, index) => {
        const depth = (index + 1) * 10; // Different depths for parallax
        
        gsap.to(element, {
          x: percentX * depth,
          y: percentY * depth,
          duration: 1,
          ease: "power2.out",
        });
      });
    };

    // Continuous floating animation
    floatingElements.forEach((element, index) => {
      gsap.to(element, {
        y: "+=20",
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(element, {
        x: "+=15",
        duration: 3 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(element, {
        rotation: 5,
        duration: 4 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
}
