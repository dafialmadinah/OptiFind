"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export function HomeSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("homeSplashShown");
    
    if (splashShown) {
      setIsVisible(false);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("homeSplashShown", "true");
          // Fade out splash screen
          gsap.to(".home-splash-screen", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => setIsVisible(false),
          });
        },
      });

      // Animasi splash screen
      tl
        // 1. Logo muncul dengan scale dan rotate
        .from(".home-splash-logo", {
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        })
        
        // 2. Tulisan "OptiFind" muncul per huruf dengan bounce
        .from(".home-splash-letter", {
          scale: 0,
          opacity: 0,
          y: 50,
          stagger: 0.08,
          duration: 0.5,
          ease: "back.out(2.5)",
        }, "-=0.3")
        
        // 3. Tagline muncul
        .from(".home-splash-tagline", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.2")
        
        // 4. Pause sebentar
        .to({}, { duration: 1.2 })
        
        // 5. Logo rotate dan scale up sedikit sebelum fade
        .to(".home-splash-logo", {
          rotation: 360,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.inOut",
        })
        
        // 6. Pause sebelum fade out
        .to({}, { duration: 0.3 });
    });

    return () => ctx.revert();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="home-splash-screen fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#4269d3] via-[#2a4190] to-[#142253]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f48b2f]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo */}
        <div className="home-splash-logo relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#f48b2f]/40 to-[#4b74d7]/40 rounded-full blur-3xl scale-150" />
          
          {/* Logo image */}
          <div className="relative">
            <Image
              src="/assets/logo.svg"
              alt="OptiFind Logo"
              width={180}
              height={180}
              className="w-36 h-36 md:w-44 md:h-44 drop-shadow-2xl relative z-10"
              priority
            />
          </div>
        </div>

        {/* Brand name dengan animasi per huruf */}
        <div className="flex items-center justify-center">
          <div className="flex text-6xl md:text-7xl font-bold">
            <span className="home-splash-letter text-white drop-shadow-lg">O</span>
            <span className="home-splash-letter text-white drop-shadow-lg">p</span>
            <span className="home-splash-letter text-white drop-shadow-lg">t</span>
            <span className="home-splash-letter text-white drop-shadow-lg">i</span>
            <span className="home-splash-letter text-[#f48b2f] drop-shadow-lg">F</span>
            <span className="home-splash-letter text-[#f48b2f] drop-shadow-lg">i</span>
            <span className="home-splash-letter text-[#f48b2f] drop-shadow-lg">n</span>
            <span className="home-splash-letter text-[#f48b2f] drop-shadow-lg">d</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="home-splash-tagline">
          <p className="text-white/90 text-center text-base md:text-lg font-medium tracking-wide max-w-md">
            Teknologi yang Menyatukan Kepedulian
          </p>
        </div>

        {/* Loading indicator */}
        <div className="home-splash-tagline flex gap-2 mt-4">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}
