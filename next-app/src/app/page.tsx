"use client";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";
import { HomeSplashScreen } from "@/components/home-splash-screen";

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

type SocialLink = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const QUICK_LINKS = [
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Fitur Platform", href: "/fitur" },
  { label: "Hubungi Kami", href: "/kontak" },
  { label: "Kebijakan Privasi", href: "/privacy" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
];

export default function LandingPage() {
  return (
    <>
      <HomeSplashScreen />
      <div className="bg-[#f2f5ff] text-slate-900">
        <LandingNavbar />
        <HeroSection />
        <HowItWorks />
        <CommunityImpact />
        <Testimonials />
        <LandingFooter />
      </div>
    </>
  );
}

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#1a2d68] via-[#1e3675] to-[#223f8a] pb-10 pt-16 text-white">
      <div className="pointer-events-none absolute left-1/2 -top-14 h-24 w-[90%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 w-40 h-40 rounded-full -left-32 bg-white/10 blur-2xl" />
        <div className="absolute w-32 h-32 rounded-full right-12 top-4 bg-white/10 blur-2xl" />
      </div>
      <div className="relative flex flex-col w-full max-w-6xl gap-12 px-6 mx-auto md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.svg" alt="OptiFind" width={64} height={64} className="w-auto h-14" />
            <p className="text-2xl font-semibold leading-tight">
              <span className="text-white">Opti</span>
              <span className="text-[#f48b2f]">Find</span>
            </p>
          </div>
          <p className="text-sm text-white/70">Teknologi yang Menyatukan Kepedulian.</p>
        </div>

        <div className="grid flex-1 gap-10 text-sm sm:grid-cols-[1fr] md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Navigasi Cepat</p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Ikuti Kami</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#1a2d68]"
                >
                  <Icon className="h-5 w-5 transition group-hover:text-[#1a2d68]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-10 h-px w-[90%] max-w-5xl bg-white/15" />
      <p className="mt-6 text-xs text-center text-white/70">&copy; {currentYear} Found It! Platform. Semua hak dilindungi undang-undang.</p>
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
    <section className="relative min-h-screen overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/8 to-white/20" />
      <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-[1200px] flex-col-reverse items-center justify-center gap-12 px-6 pb-16 pt-36 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
        <div className="max-w-xl text-center fade-up md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70 md:text-sm">PLATFORM OPTIFIND</p>
          <h1 className="mt-6 text-[34px] font-bold leading-tight text-white md:text-[48px]">
            Temukan Barangmu,<span className="text-[#f48b2f]"> Bantu Orang Lain Menemukan Miliknya</span>
          </h1>
          <p className="mt-5 text-base text-white/85 md:text-lg">
            Platform untuk melapor dan menemukan barang hilang di sekitar Anda dengan pencarian pintar dan koneksi komunitas.
          </p>
          <div className="flex flex-col gap-3 mt-10 sm:flex-row sm:items-center">
            <Link
              href="/barangs/lapor-hilang"
              className="btn-glow inline-flex items-center justify-center rounded-[12px] bg-[#f48b2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#dd7926] sm:min-w-[190px]"
            >
              Laporkan Sekarang
            </Link>
            <Link
              href="/cari?tipe=Temuan"
              className="btn-glow inline-flex items-center justify-center rounded-[12px] border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#1d2d5a] sm:min-w-[200px]"
            >
              Lihat Barang Ditemukan
            </Link>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-full max-w-md md:max-w-lg">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f48b2f]/40 via-transparent to-[#4b74d7]/40 blur-3xl" />
          <Image
            src="/assets/logo.svg"
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
  return (
    <section id="cara-kerja" className="py-16 bg-white">
      <div className="max-w-5xl px-6 mx-auto text-center">
        <h2 className="text-3xl font-semibold text-[#1d1d1d] md:text-4xl">Bagaimana OptiFind Bekerja</h2>
        <p className="mt-3 text-sm text-[#6b6b6b] md:text-base">
          Proses sederhana dalam tiga langkah untuk membantu Anda menemukan barang yang hilang.
        </p>
        <div className="grid gap-6 mt-10 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`fade-up rounded-[18px] border border-[#e6e6e6] bg-white px-6 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                index === 1 ? "fade-up-delay-1" : index === 2 ? "fade-up-delay-2" : ""
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f5ff]">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1d]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityImpact() {
  return (
    <section id="dampak" className="relative overflow-hidden bg-gradient-to-br from-[#203063] via-[#243873] to-[#142253] py-20 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(circle at top left, rgba(255,255,255,0.25), transparent 60%)" }}
      />
      <div className="relative flex flex-col max-w-6xl gap-12 px-6 mx-auto md:flex-row md:items-center md:justify-between">
        <div className="relative fade-up md:w-1/2">
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            <span className="text-[#f48b2f]">Dampak</span> Komunitas Kami
          </h2>
          <p className="mt-4 text-sm text-white/80 md:text-base">
            Bersama membangun ekosistem kepedulian terhadap barang hilang dan temuan. Setiap laporan membawa harapan kembali kepada pemiliknya.
          </p>
        </div>
        <div className="grid gap-6 md:w-1/2 md:grid-cols-3">
          {IMPACT_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`fade-up rounded-[22px] bg-[#1f2d5c]/70 px-6 py-8 text-center shadow-xl backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-2xl ${
                index === 1 ? "fade-up-delay-1" : index === 2 ? "fade-up-delay-2" : ""
              }`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f48b2f] text-[#142253] shadow-lg">
                {stat.icon}
              </div>
              <p className="mt-6 text-2xl font-bold text-white md:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs font-medium tracking-wide uppercase text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimoni" className="relative py-20 bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[420px_1fr] lg:gap-16">
        <div className="fade-up rounded-[32px] bg-gradient-to-br from-[#3d5086] to-[#2d3f6b] p-10 text-white shadow-2xl lg:-mt-20 lg:p-12">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Apa kata
              <br />
              mereka?
            </h2>
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-16 h-16 p-2 bg-white rounded-full shadow-lg">
                <Image src="/assets/logo_kecil.svg" alt="OptiFind" width={48} height={48} />
              </span>
              <div>
                <p className="text-xl font-bold text-white">OptiFind</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex gap-1 text-yellow-300">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </span>
                  <span className="text-lg font-semibold text-[#f48b2f]">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/feedback"
              className="btn-glow inline-flex w-full items-center justify-center rounded-[12px] bg-[#f48b2f] px-6 py-4 text-base font-bold text-white transition hover:bg-[#d67d3a] shadow-lg hover:shadow-xl"
            >
              Beri Kami Feedback untuk Terus Berkembang
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          {TESTIMONIALS.map((item, index) => (
            <article
              key={item.name}
              className={`fade-up rounded-[28px] bg-[#f8f9fa] px-10 py-8 shadow-lg transition hover:shadow-xl ${
                index === 1 ? "fade-up-delay-1" : ""
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f48b2f] to-[#f5a85f] text-2xl font-bold text-white shadow-lg">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#3d5086]">{item.name}</h3>
                    <span className="flex gap-1 text-yellow-400">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </span>
                  </div>
                  <p className="mb-4 text-[15px] leading-relaxed text-[#5a5a5a]">{item.quote}</p>
                  <p className="text-xs font-semibold text-[#8b8b8b]">{item.status}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f48b2f] bg-white text-2xl text-[#f48b2f] transition hover:bg-[#f48b2f] hover:text-white shadow-lg"
              aria-label="Sebelumnya"
            >
              &larr;
            </button>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f48b2f] text-2xl text-white transition hover:bg-[#d67d3a] shadow-xl"
              aria-label="Selanjutnya"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}