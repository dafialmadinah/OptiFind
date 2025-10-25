import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#f2f5ff] text-slate-900">
      <HeroSection />
      <HowItWorks />
      <CommunityImpact />
      <Testimonials />
      <LandingFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff]/5 via-[#ffffff]/8 to-[#ffffff]/20" />
      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-[1200px] flex-col-reverse items-center justify-center gap-12 px-6 pb-16 pt-32 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
        <div className="fade-up max-w-xl text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70 md:text-sm">PLATFORM OPTIFIND</p>
          <h1 className="mt-6 text-[34px] font-bold leading-tight text-white md:text-[48px]">
            Temukan Barangmu,
            <span className="text-[#f48b2f]"> Bantu Orang Lain Menemukan Miliknya</span>
          </h1>
          <p className="mt-5 text-base text-white/85 md:text-lg">
            Platform untuk melapor dan menemukan barang hilang di sekitar Anda dengan pencarian pintar dan koneksi komunitas.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <div className="relative flex w-full max-w-md items-center justify-center md:max-w-lg">
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
  const steps = [
    {
      title: "Laporkan Barang",
      description:
        "Isi laporan dengan detail barang dan lokasi kehilangan. Semakin detail, semakin mudah ditemukan.",
      icon: "??",
    },
    {
      title: "Pencarian Otomatis",
      description:
        "Sistem mencocokkan laporan hilang dan temuan secara otomatis berdasarkan lokasi dan deskripsi.",
      icon: "??",
    },
    {
      title: "Terhubung Aman",
      description:
        "Temui penemu dan konfirmasi kepemilikan barang melalui platform yang aman dan terpercaya.",
      icon: "??",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-semibold text-[#1d1d1d] md:text-4xl">Bagaimana OptiFind Bekerja</h2>
        <p className="mt-3 text-sm text-[#6b6b6b] md:text-base">
          Proses sederhana dalam tiga langkah untuk membantu Anda menemukan barang yang hilang.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`fade-up rounded-[18px] border border-[#e6e6e6] bg-white px-6 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                index === 1 ? "fade-up-delay-1" : index === 2 ? "fade-up-delay-2" : ""
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5] text-2xl">
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
  const stats = [
    { label: "Barang Ditemukan", value: "10,000+" },
    { label: "Pengguna Aktif", value: "5,000+" },
    { label: "Tingkat Keberhasilan", value: "97%" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#364991] to-[#1a2654] py-20 text-white">
      <div className="absolute inset-0 bg-[url('/assets/banner_hilang.png')] bg-cover bg-center opacity-10" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-center md:justify-between">
        <div className="fade-up md:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f48b2f]">DAMPAK KOMUNITAS KAMI</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Bersama membangun ekosistem kepedulian terhadap barang hilang.
          </h2>
          <p className="mt-4 text-sm text-white/80 md:text-base">
            Setiap laporan yang masuk membantu banyak orang mendapatkan kembali barang berharganya. OptiFind terus berkembang berkat partisipasi aktif komunitas.
          </p>
        </div>
        <div className="grid gap-6 md:w-1/2 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`fade-up rounded-[18px] bg-white/10 px-5 py-6 text-center shadow-inner ${
                index === 1 ? "fade-up-delay-1" : index === 2 ? "fade-up-delay-2" : ""
              }`}
            >
              <p className="text-2xl font-semibold text-[#f48b2f] md:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Ahmad Rizki",
      quote:
        "OptiFind mempermudah saya menemukan dompet yang hilang saat acara kampus. Prosesnya cepat dan aman, sangat membantu!",
      status: "Barang Hilang ? (Telah ditemukan)",
    },
    {
      name: "Maya Sari",
      quote:
        "Saya menemukan tas seseorang dan bisa mengembalikannya dengan mudah melalui OptiFind. Platform ini wajib ada di setiap kampus.",
      status: "Barang Temuan ? (Telah dikembalikan)",
    },
  ];

  return (
    <section className="bg-[#f6f8ff] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f48b2f]">APA KATA MEREKA?</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1d1d1d] md:text-4xl">Testimoni dari pengguna OptiFind</h2>
          </div>
          <div className="fade-up fade-up-delay-1 flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow">
            <Image src="/assets/logo_kecil.svg" width={32} height={32} alt="OptiFind" />
            <div className="text-sm">
              <p className="font-semibold text-[#1d1d1d]">OptiFind Rating</p>
              <p className="text-xs text-[#6b6b6b]">4.8/5</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.name}
              className={`fade-up flex h-full flex-col rounded-[20px] bg-white px-8 py-8 shadow-md ${
                index === 1 ? "fade-up-delay-1" : ""
              }`}
            >
              <p className="text-sm leading-relaxed text-[#4c4c4c]">{item.quote}</p>
              <div className="mt-6">
                <p className="text-base font-semibold text-[#1d1d1d]">{item.name}</p>
                <p className="text-xs text-[#6b6b6b]">{item.status}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/feedback"
            className="btn-glow inline-flex w-full justify-center rounded-[12px] border border-[#f48b2f] px-6 py-3 text-sm font-semibold text-[#f48b2f] transition hover:bg-[#f48b2f] hover:text-white md:w-auto"
          >
            Beri Kami Feedback untuk Terus Berkembang
          </Link>
          <div className="flex justify-center gap-3 md:justify-end">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f48b2f] text-[#f48b2f] transition hover:bg-[#f48b2f] hover:text-white"
            >
              ?
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f48b2f] text-[#f48b2f] transition hover:bg-[#f48b2f] hover:text-white"
            >
              ?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121a3a] py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo_kecil.svg" alt="OptiFind" width={40} height={40} />
            <div>
              <p className="text-lg font-semibold">OptiFind</p>
              <p className="text-xs text-white/70">Teknologi yang menyatukan kepedulian.</p>
            </div>
          </div>
          <p className="max-w-sm text-xs text-white/60">
            Platform pelaporan barang hilang dan temuan yang membantu menghubungkan masyarakat dengan aman dan cepat.
          </p>
        </div>
        <div className="grid gap-10 text-sm md:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Navigasi Cepat</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li>
                <Link href="/barangs/lapor-hilang">Tata Cara Lapor</Link>
              </li>
              <li>
                <Link href="/barangs/lapor-temuan">Fitur Platform</Link>
              </li>
              <li>
                <Link href="/kontak">Hubungi Kami</Link>
              </li>
              <li>
                <Link href="/privacy">Kebijakan Privasi</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Ikuti Kami</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li>
                <Link href="https://instagram.com" target="_blank">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" target="_blank">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://facebook.com" target="_blank">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Support</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/feedback">Pusat Bantuan</Link>
              </li>
              <li>
                <Link href="/term">Syarat & Ketentuan</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
        © {currentYear} OptiFind Platform. Semua hak dilindungi undang-undang.
      </div>
    </footer>
  );
}
