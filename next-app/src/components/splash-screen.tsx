"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, Flip } from "@/lib/gsap";

export function SplashScreen() {
  const [isActive, setIsActive] = useState(true);
  const splashRef = useRef<HTMLDivElement>(null);
  const runFlipRef = useRef<(instant?: boolean) => void>();
  const timeoutRef = useRef<number>();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const splashEl = splashRef.current;
    const splashLogo = splashEl?.querySelector<HTMLElement>("[data-brand-logo-source]");
    const heroLogo = document.querySelector<HTMLElement>("[data-brand-logo-target]");

    if (!splashEl || !splashLogo || !heroLogo) {
      setIsActive(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    hasCompletedRef.current = false;

    const showHeroLogo = () => {
      gsap.set(heroLogo, { autoAlpha: 1, clearProps: "opacity,visibility,transform" });
    };

    const finalize = () => {
      showHeroLogo();
      setIsActive(false);
    };

    if (prefersReducedMotion) {
      finalize();
      return;
    }

    gsap.set(heroLogo, { autoAlpha: 0 });

    const runFlip = (instant = false) => {
      if (hasCompletedRef.current) {
        return;
      }
      hasCompletedRef.current = true;
      window.clearTimeout(timeoutRef.current);

      const duration = instant ? 0.0001 : 0.8;

      Flip.fit(splashLogo, heroLogo, {
        duration,
        ease: "power3.out",
        absolute: true,
        onComplete: showHeroLogo,
      });

      gsap.to(splashEl, {
        autoAlpha: 0,
        duration,
        ease: "power3.out",
        onComplete: finalize,
      });
    };

    runFlipRef.current = runFlip;

    timeoutRef.current = window.setTimeout(() => runFlip(), 1700);

    return () => {
      window.clearTimeout(timeoutRef.current);
      runFlipRef.current = undefined;
      gsap.killTweensOf(splashEl);
      gsap.killTweensOf(splashLogo);
    };
  }, [isActive]);

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div
      ref={splashRef}
      className="splash-screen fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#4269d3] via-[#2a4190] to-[#142253] text-white"
    >
      <button
        type="button"
        className="absolute right-6 top-6 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={() => runFlipRef.current?.(true)}
      >
        Skip
      </button>
      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <div
          data-flip-id="brandLogo"
          data-brand-logo-source
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f48b2f]/40 to-[#4b74d7]/40 blur-2xl" />
          <Image src="/assets/logo.svg" alt="OptiFind" width={160} height={160} className="relative z-10 h-28 w-28" priority />
        </div>
        <p className="max-w-xs text-sm font-medium leading-relaxed text-white/80">
          Teknologi yang Menyatukan Kepedulian
        </p>
      </div>
    </div>
  );
}
