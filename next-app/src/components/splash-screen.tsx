"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    
    if (splashShown) {
      setIsVisible(false);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".splash-text-wrapper", { display: "none", opacity: 0, x: 40 });
      gsap.set(".splash-text-opti", { opacity: 0, x: 20 });
      gsap.set(".splash-text-find", { opacity: 0, x: 20 });
      gsap.set(".splash-tagline", { opacity: 0, y: 20 });
      gsap.set(".loading-dots", { opacity: 0, y: 20 });
      gsap.set(".splash-container", { x: 0 });
      gsap.set(".splash-logo", { x: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("splashShown", "true");
          // Fade out splash screen
          gsap.to(".splash-screen", {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => setIsVisible(false),
          });
        },
      });

      tl
        // 1. Logo muncul di tengah dengan scale dan rotate
        .from(".splash-logo", {
          scale: 0.3,
          opacity: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        })
        .to(".splash-logo", {
          rotate: 360,
          duration: 0.8,
          ease: "power2.inOut",
        }, "-=0.4")
        .to(".loading-dots", {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.2")
        
        // 2. Loading pause
        .to({}, { duration: 3 })
        
        // 3. Sembunyikan loading dots
        .to(".loading-dots", {
          opacity: 0,
          y: -20,
          duration: 0.35,
          ease: "power2.in",
        })
        
        // 4. Logo geser ke kiri, teks masuk
        .to(".splash-logo", {
          x: -70,
          scale: 0.92,
          duration: 0.7,
          ease: "power2.inOut",
        }, "-=0.1")
        .set(".splash-text-wrapper", { display: "flex" })
        .to(".splash-text-wrapper", {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
        }, "-=0.4")
        .to([".splash-text-opti", ".splash-text-find"], {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.1,
        }, "<0.05")
        .to(".splash-tagline", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.2")
        
        // 5. Pause sebentar
        .to({}, { duration: 1 })
        
        // 6. Teks keluar dan logo kembali ke tengah
        .to([".splash-text-find", ".splash-text-opti"], {
          opacity: 0,
          x: 40,
          duration: 0.35,
          ease: "power2.in",
          stagger: 0.05,
        })
        .to(".splash-text-wrapper", {
          opacity: 0,
          x: 40,
          duration: 0.3,
          ease: "power2.in",
        }, "<0.05")
        .to(".splash-tagline", {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        }, "<0.1")
        .set(".splash-text-wrapper", { display: "none" })
        .to(".splash-logo", {
          x: 0,
          scale: 1.1,
          duration: 0.7,
          ease: "power2.inOut",
        }, "-=0.1")
        
        // 7. Logo rotate sekali lagi sebelum fade out
        .to(".splash-logo", {
          rotate: "+=360",
          duration: 0.7,
          ease: "power2.inOut",
        }, "-=0.3")
        
        // 8. Pause sebentar sebelum fade out
        .to({}, { duration: 0.3 });
    });

    return () => ctx.revert();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#4269d3] via-[#2a4190] to-[#142253]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f48b2f]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Main content container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 splash-container">
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            {/* Logo with subtle glow */}
            <div className="relative splash-logo">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f48b2f]/30 to-[#4b74d7]/30 blur-3xl" />
              <div className="relative">
                <Image
                  src="/assets/logo.svg"
                  alt="OptiFind Logo"
                  width={200}
                  height={200}
                  className="relative z-10 h-44 w-44 drop-shadow-2xl md:h-52 md:w-52"
                  priority
                />
              </div>
            </div>

            {/* Brand name */}
            <div
              className="splash-text-wrapper pointer-events-none ml-5 flex items-center gap-2 whitespace-nowrap font-bold text-5xl opacity-0 md:text-6xl"
              style={{ display: "none" }}
            >
              <span className="splash-text-opti text-white drop-shadow-lg">Opti</span>
              <span className="splash-text-find text-[#f48b2f] drop-shadow-lg">Find</span>
            </div>
          </div>

          <div className="splash-tagline opacity-0">
            <p className="text-center text-sm font-medium tracking-wide text-white/80 md:text-base">
              Teknologi yang Menyatukan Kepedulian
            </p>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="loading-dots absolute left-1/2 top-full mt-10 flex -translate-x-1/2 gap-2 opacity-0">
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "0s" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "0.15s" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}
