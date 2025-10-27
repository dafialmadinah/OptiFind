"use client";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LandingNavbar } from "@/components/landing-navbar";
import { HomeSplashScreen } from "@/components/home-splash-screen";
import { useMorphingHowItWorks } from "@/hooks/useMorphingHowItWorks";
import { useImpactCountUp } from "@/hooks/useImpactCountUp";
import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: ReactElement;
};

type Stat = {
  label: string;
  value: string;
  icon: ReactElement;
};

type Testimonial = {
  name: string;
  quote: string;
  status: string;
};

const STEPS: Step[] = [
  {
    title: "Laporkan Barang",
    description:
      "Isi laporan dengan detail barang dan lokasi kehilangan. Semakin detail, semakin mudah ditemukan.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#f48b2f]" aria-hidden>
        <path
          fill="currentColor"
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm3.92-1.42 7.59-7.59 1.42 1.42-7.59 7.59H6.92v-1.42zM20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a1 1 0 0 0 0-1.41z"
        />
      </svg>
    ),
  },
  {
    title: "Pencarian Otomatis",
    description:
      "Sistem mencocokkan laporan hilang dan temuan secara otomatis berdasarkan lokasi dan deskripsi.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#f48b2f]" aria-hidden>
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5 1.5-1.5-5-5zm-5.5 0A4 4 0 1 1 14 10a4 4 0 0 1-4 4z"
        />
      </svg>
    ),
  },
  {
    title: "Terhubung Aman",
    description:
      "Temui penemu dan konfirmasi kepemilikan barang melalui platform yang aman dan terpercaya.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#f48b2f]" aria-hidden>
        <path
          fill="currentColor"
          d="M21 7h-6V5a3 3 0 0 0-6 0v2H3a1 1 0 0 0-1 1v3.34a4 4 0 0 0 2.16 3.57l5.21 2.76A3 3 0 0 0 12 18a3 3 0 0 0 2.63 1.66 3 3 0 0 0 1.35-.32l5.21-2.76A4 4 0 0 0 22 11.34V8a1 1 0 0 0-1-1zm-11-2a1 1 0 0 1 2 0v2h-2zm10 6.34a2 2 0 0 1-1.08 1.79l-5.21 2.76a1 1 0 0 1-1.42-.89V14h-2v2a1 1 0 0 1-1.42.89l-5.21-2.76A2 2 0 0 1 4 11.34V9h16z"
        />
      </svg>
    ),
  },
];

const IMPACT_STATS: Stat[] = [
  {
    label: "Barang Ditemukan",
    value: "10,000+",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#142253]" aria-hidden>
        <path fill="currentColor" d="M9.5 16.6 5.4 12.5l1.4-1.4 2.7 2.7 7.3-7.3 1.4 1.42z" />
      </svg>
    ),
  },
  {
    label: "Pengguna Aktif",
    value: "5,000+",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#142253]" aria-hidden>
        <path
          fill="currentColor"
          d="M16 13c-1.66 0-3 1.34-3 3v1h8v-1c0-1.66-1.34-3-3-3h-2zm-8 0c-1.66 0-3 1.34-3 3v1h6v-1c0-1.66-1.34-3-3-3zm8-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
      </svg>
    ),
  },
  {
    label: "Tingkat Keberhasilan",
    value: "97%",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#142253]" aria-hidden>
        <path
          fill="currentColor"
          d="M10 19c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm10-14c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-4.9 2.1-9 9 1.8 1.8 9-9-1.8-1.8z"
        />
      </svg>
    ),
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmad Rizki",
    quote:
      "OptiFind mempermudah saya menemukan dompet yang hilang saat acara kampus. Prosesnya cepat dan aman, sangat membantu!",
    status: "Barang Hilang -> (Telah ditemukan)",
  },
  {
    name: "Maya Sari",
    quote:
      "Saya menemukan tas seseorang dan bisa mengembalikannya dengan mudah melalui OptiFind. Platform ini wajib ada di setiap kampus.",
    status: "Barang Temuan -> (Telah dikembalikan)",
  },
];

const SOCIAL_LINKS: ReadonlyArray<{ label: string; href: string; Icon: LucideIcon }> = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
];

const HERO_SELECTORS = {
  headline: "[data-hero-headline]",
  copy: "[data-hero-copy]",
  subtitle: "[data-hero-subtitle]",
  primaryCta: "[data-hero-cta-primary]",
  secondaryCta: "[data-hero-cta-secondary]",
  visual: "[data-hero-visual]",
} as const;

function useLandingAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const subtitle = hero.querySelector<HTMLElement>(HERO_SELECTORS.subtitle);
        const headline = hero.querySelector<HTMLElement>(HERO_SELECTORS.headline);
        const copy = hero.querySelector<HTMLElement>(HERO_SELECTORS.copy);
        const primaryCta = hero.querySelector<HTMLElement>(HERO_SELECTORS.primaryCta);
        const secondaryCta = hero.querySelector<HTMLElement>(HERO_SELECTORS.secondaryCta);
        const visual = hero.querySelector<HTMLElement>(HERO_SELECTORS.visual);

        if (reduceMotion) {
          // Simple fade-in for reduced motion
          [subtitle, headline, copy, primaryCta, secondaryCta, visual].forEach((el) => {
            if (el) gsap.set(el, { autoAlpha: 1 });
          });
        } else {
          // Initial set for on-load animation
          [subtitle, headline, copy, primaryCta, secondaryCta].forEach((el) => {
            if (el) gsap.set(el, { autoAlpha: 0, y: 32 });
          });

          if (visual) {
            gsap.set(visual, { autoAlpha: 0, y: 40, scale: 0.95 });
          }

          // On-load sequence (staggered entrance)
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top 75%",
              once: true,
            },
          });

          if (subtitle)
            heroTimeline.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0);
          if (headline)
            heroTimeline.to(
              headline,
              { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
              "<+=0.15"
            );
          if (copy)
            heroTimeline.to(
              copy,
              { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "<+=0.15"
            );
          if (primaryCta)
            heroTimeline.to(
              primaryCta,
              { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "<+=0.2"
            );
          if (secondaryCta)
            heroTimeline.to(
              secondaryCta,
              { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "<+=0.1"
            );
          if (visual)
            heroTimeline.to(
              visual,
              { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" },
              "<+=0.2"
            );

          // Hero scroll-out (parallax exit) - REMOVED untuk menghindari elemen menghilang
          // Visual dan text tetap terlihat saat scroll ke section berikutnya

          // Background gradient parallax
          const heroGradient = hero.querySelector<HTMLElement>(".hero-gradient");
          if (heroGradient) {
            gsap.to(heroGradient, {
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
              },
              backgroundPosition: "50% 60%",
              ease: "none",
            });
          }
        }
      }

      // Global fade-up utility (keep existing)
      const fadeUps = gsap.utils.toArray<HTMLElement>(".fade-up");
      fadeUps.forEach((element) => {
        const delayClass = element.classList.contains("fade-up-delay-1")
          ? 0.15
          : element.classList.contains("fade-up-delay-2")
          ? 0.3
          : 0;

        gsap.set(element, { autoAlpha: 0, y: reduceMotion ? 0 : 40, willChange: "transform" });
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0.3 : 1,
          ease: "power2.out",
          delay: delayClass,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
          },
          onComplete: () => {
            element.style.willChange = "auto";
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);
}

// Magnetic button effect
function useMagneticButtons() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const buttons = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
    
    buttons.forEach((button) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        });
      };

      button.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);
}

// Curtain effect for Testimonials section - animate the blue background
export default function LandingPage() {
  useLandingAnimations();
  useMagneticButtons();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2f5ff] text-slate-900">
      <HomeSplashScreen />
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <CommunityImpact />
      <TestimonialsSection />
      <MobileFooter />
    </div>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimoni" className="bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#3d5086] to-[#2d3f6b] p-10 text-white shadow-2xl sm:p-12">
          <div className="space-y-8">
            <h2 className="text-[30px] leading-[1.1] font-bold sm:text-[34px]">Apa kata mereka?</h2>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Image src="/assets/magnifier.svg" alt="OptiFind" width={34} height={34} className="h-8 w-8" />
                <span className="text-2xl font-semibold">
                  <span className="text-white">Opti</span>
                  <span className="text-[#f48b2f]">Find</span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">
                <span className="flex gap-1 text-yellow-300">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </span>
                <span className="font-semibold text-[#f5a85f]">4.8/5</span>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed sm:text-base">
              Cerita nyata dari pengguna yang berhasil menemukan barangnya kembali dan menjaga kepercayaan komunitas.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {TESTIMONIALS.map((item, index) => (
            <article
              key={item.name}
              className={`rounded-[20px] border border-slate-100 bg-[#f8f9fa] px-6 py-7 shadow-sm transition-all duration-200 sm:px-8 sm:py-8 ${
                index === 1 ? "fade-up-delay-1" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f48b2f] to-[#f5a85f] text-xl font-bold text-white shadow-lg">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h3 className="text-[20px] font-semibold text-[#3d5086] sm:text-[22px]">{item.name}</h3>
                    <span className="flex gap-1 text-yellow-400">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">{item.quote}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.status}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#f2f5ff] p-6 text-center sm:flex-row sm:justify-between sm:p-8">
          <h3 className="text-lg font-semibold text-[#1d2d5a] sm:text-xl">Punya cerita? Bantu kami berkembang.</h3>
          <Link
            href="/feedback"
            className="inline-flex items-center justify-center rounded-[18px] bg-[#f48b2f] px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#d67d3a] shadow-lg hover:shadow-xl"
          >
            Beri Feedback
          </Link>
        </div>
      </div>
    </section>
  );
}

function MobileFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1a2d68] via-[#1e3675] to-[#223f8a] px-6 py-12 text-white sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/assets/magnifier.svg" alt="OptiFind" width={32} height={32} className="h-9 w-9" />
            <span className="text-2xl font-semibold">
              <span className="text-white">Opti</span>
              <span className="text-[#f48b2f]">Find</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Solusi terpadu untuk melaporkan barang hilang dan menemukan pemiliknya kembali dengan cepat.
          </p>
        </div>

        <div className="grid gap-6 text-sm text-white/75 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Navigasi</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/tentang" className="transition hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="transition hover:text-white">
                  Fitur Platform
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="transition hover:text-white">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Ikuti Kami</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#1a2d68]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-white/60">&copy; {currentYear} OptiFind. Semua hak dilindungi.</p>
    </footer>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 1.5 12.59 7l5.91.52-4.52 3.92 1.41 5.81L10 14.9l-5.39 2.35L6.02 11.4 1.5 7.52 7.41 7z" />
    </svg>
  );
}

function HeroSection() {
  return (
    <section id="beranda" className="relative overflow-hidden md:min-h-screen" data-hero>
      {/* Parallax gradient background */}
      <div 
        className="hero-gradient absolute inset-0 bg-gradient-to-br from-[#203063] via-[#28407a] to-[#142253]"
        style={{ backgroundSize: "150% 150%", backgroundPosition: "50% 50%" }}
      />
      
      <div className="relative z-[2] mx-auto flex w-full max-w-[1200px] flex-col-reverse items-center justify-center gap-10 px-6 pb-20 pt-28 sm:gap-12 sm:px-8 md:h-full md:flex-row md:items-center md:justify-between md:px-12 md:pb-24 md:pt-32 lg:px-20">
        <div className="max-w-xl text-center md:text-left">
          <p 
            className="uppercase tracking-[0.22em] text-xs text-white/70" 
            data-hero-subtitle
          >
            PLATFORM OPTIFIND
          </p>
          <h1
            className="mt-6 text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-extrabold text-white"
            data-hero-headline
          >
            Temukan Barangmu,
            <span className="text-[#f48b2f]"> Bantu Orang Lain Menemukan Miliknya</span>
          </h1>
          <p 
            className="mt-5 text-[16px] md:text-[17px] leading-[1.7] text-white/85" 
            data-hero-copy
          >
            Platform untuk melapor dan menemukan barang hilang di sekitar Anda dengan pencarian pintar dan koneksi komunitas.
          </p>
          <div className="flex flex-col gap-3 mt-10 sm:flex-row sm:items-center">
            <Link
              href="/barangs/lapor-hilang"
              className="inline-flex items-center justify-center rounded-[20px] bg-[#f48b2f] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#dd7926] sm:min-w-[190px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              data-hero-cta-primary
              data-magnetic
            >
              Laporkan Sekarang
            </Link>
            <Link
              href="/cari?tipe=Temuan"
              className="inline-flex items-center justify-center rounded-[20px] border-2 border-white/70 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#1d2d5a] sm:min-w-[200px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              data-hero-cta-secondary
              data-magnetic
            >
              Lihat Barang Ditemukan
            </Link>
          </div>
        </div>
        <div 
          className="relative flex items-center justify-center w-full max-w-md md:max-w-lg will-change-transform" 
          data-hero-visual
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f48b2f]/40 via-transparent to-[#4b74d7]/40 blur-3xl" />
          <Image
            src="/assets/magnifier.svg"
            alt="OptiFind Illustration"
            width={360}
            height={360}
            className="floating relative h-auto w-3/4 max-w-[320px] drop-shadow-2xl md:w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  useMorphingHowItWorks();

  return (
    <section id="cara-kerja" className="bg-gradient-to-b from-[#f2f5ff] to-white section py-20 sm:py-24 md:h-screen md:py-0 md:overflow-hidden">
      <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
        <div className="w-full max-w-6xl px-5 mx-auto overflow-visible sm:px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <header className="text-center mb-14 will-change-transform sm:mb-16" data-stage-header>
            <h2 className="text-[30px] leading-[1.1] tracking-[-0.01em] font-bold text-slate-900 sm:text-[32px] md:text-[40px]">
              Bagaimana OptiFind Bekerja
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.7] text-slate-600 md:text-[17px]">
              Proses sederhana dalam tiga langkah untuk membantu Anda menemukan barang yang hilang.
            </p>
          </header>

          {/* Morphing Track - Cards will animate width */}
          <div className="flex flex-col gap-6 overflow-visible track md:flex-row" data-track>
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                className="card flex h-auto flex-col rounded-[20px] border-2 border-slate-200 bg-white px-6 py-8 shadow-sm transition-all duration-200 will-change-transform hover:-translate-y-1 hover:shadow-2xl sm:px-8 sm:py-10 md:h-[380px]"
                data-card
                data-index={index}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f48b2f]/10 to-[#f48b2f]/5 transition-transform hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="text-[22px] md:text-[24px] leading-[1.2] font-semibold text-slate-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-[16px] md:text-[17px] leading-[1.7] text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityImpact() {
  useImpactCountUp();

  return (
    <section id="dampak" className="py-20 overflow-hidden text-white section sm:py-24 md:h-screen md:py-0">
      <div
        className="impact-bg flex min-h-[460px] items-center bg-gradient-to-br from-[#203063] via-[#28407a] to-[#142253] will-change-transform md:sticky md:top-0 md:h-screen"
        data-impact-bg
        style={{ backgroundSize: "120% 120%", backgroundPosition: "50% 50%" }}
      >
        <div className="flex flex-col items-start w-full max-w-6xl gap-16 px-6 py-12 mx-auto md:flex-row md:items-center md:justify-between md:gap-24 md:px-10 md:py-0">
          <div data-step className="max-w-lg">
            <h2 className="text-[34px] leading-[1.05] tracking-[-0.02em] font-extrabold text-white sm:text-[40px] md:text-[56px]">
              <span className="text-[#f48b2f]">Dampak</span>
              <br />
              Komunitas Kami
            </h2>
            <p className="mt-6 text-[16px] leading-[1.7] text-white/85 md:mt-8 md:text-[17px]">
              Bersama membangun ekosistem kepedulian terhadap barang hilang dan temuan. Setiap laporan membawa harapan kembali kepada pemiliknya.
            </p>
          </div>
          <div data-step className="grid w-full max-w-xl gap-10 sm:gap-12 md:grid-cols-3 md:gap-16">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center group">
                <div className="stats-icon-circle flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#f48b2f] to-[#f5a85f] text-[#142253] shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                  {stat.icon}
                </div>
                <div className="mt-8 text-[40px] md:text-[48px] font-extrabold text-white leading-none">
                  {stat.value === "10,000+" && <span data-counter data-to="10000" data-suffix="+">0</span>}
                  {stat.value === "5,000+" && <span data-counter data-to="5000" data-suffix="+">0</span>}
                  {stat.value === "97%" && <span data-counter data-to="97" data-suffix="%">0</span>}
                </div>
                <p className="mt-4 uppercase tracking-[0.22em] text-xs text-white/70 whitespace-nowrap font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
