"use client";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Custom cursor follower for premium feel
 * Creates smooth custom cursor that follows mouse
 */
export function useCursorFollower() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check if mobile
    if (window.innerWidth <= 768) return;

    // Add class to body to hide default cursor
    document.body.classList.add("custom-cursor-active");

    // Create cursor element
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(244, 139, 47, 0.5);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, background 0.3s;
    `;
    document.body.appendChild(cursor);

    // Cursor trail
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(244, 139, 47, 0.8);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(trail);

    let mouseX = 0;
    let mouseY = 0;

    // Follow mouse smoothly
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(trail, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    // Expand on interactive elements
    const handleMouseEnter = () => {
      gsap.to(cursor, {
        width: 40,
        height: 40,
        background: "rgba(244, 139, 47, 0.6)",
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        width: 20,
        height: 20,
        background: "rgba(244, 139, 47, 0.5)",
        duration: 0.3,
      });
    };

    // Add listeners
    window.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll<HTMLElement>(
      "a, button, [data-magnetic], [data-card]"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      cursor.remove();
      trail.remove();
    };
  }, []);
}
