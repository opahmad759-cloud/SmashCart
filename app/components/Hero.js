import Link from "next/link";
import Image from "next/image";

const stats = [
  { big: "493 KM/H", small: "World Record Smash Speed" },
  { big: "100%", small: "Official Match Grade" },
  { big: "COD", small: "Pay On Delivery Nationwide" },
];

export default function Hero() {
  return (
    <section className="court-grid relative overflow-hidden bg-[radial-gradient(1000px_500px_at_80%_20%,color-mix(in_srgb,var(--color-brand)_14%,transparent),transparent)] pb-18 pt-14 border-b border-line">
      <div className="relative mx-auto grid max-w-295 items-center gap-12 px-5 lg:grid-cols-[1.15fr_1fr]">
        {/* Left Column: Bold Tournament Typography */}
        <div className="animate-fade-in-up">
          <div className="mb-4.5 inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-card px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            <span className="text-ink">2026 Pro Tournament Series</span>
            <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-black text-brand">BWF APPROVED</span>
          </div>

          <h1 className="mb-5 text-[clamp(40px,5.8vw,74px)] font-black uppercase leading-[0.94] tracking-[-0.04em]">
            ENGINEERED FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink via-ink to-brand">SUPREME</span> <br />
            <em className="not-italic text-brand">SMASH VELOCITY.</em>
          </h1>

          <p className="mb-7 max-w-135 text-[17px] leading-relaxed text-muted">
            High-modulus carbon graphite racquets, tournament-grade goose feather shuttles, and non-marking court shoes built for lightning footwork and explosive overhead smashes.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/products?category=racket"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.75 hover:shadow-xl hover:shadow-brand/35 active:scale-95"
            >
              <span>Explore Racquets</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-y-0.75 hover:border-brand active:scale-95"
            >
              View All Gear
            </Link>
          </div>

          {/* Tournament Specs / Metric Strip */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6">
            {stats.map((s) => (
              <div key={s.small} className="transition-transform duration-200 hover:-translate-y-0.5">
                <b className="block text-[clamp(20px,2.4vw,28px)] font-black tracking-tight text-ink">{s.big}</b>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">{s.small}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real Racquet Showcase & Technical HUD Cards */}
        <div className="relative mx-auto w-full max-w-115 lg:max-w-none animate-fade-in-up-delay-1">
          {/* Background Technical Geometry */}
          <div className="relative aspect-square w-full rounded-3xl border border-line bg-card/80 p-6 backdrop-blur-xs shadow-xl overflow-hidden">
            {/* Speed Lines & Angular Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,color-mix(in_srgb,var(--color-brand)_15%,transparent),transparent_70%)]" />
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-dashed border-brand/25 animate-pulse-subtle" />
            <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full border border-line opacity-60" />

            {/* Real Product Image with 3D Hover & Subtle Float */}
            <div className="relative h-full w-full animate-float-slow group">
              <Image
                src="/images/products/racket-1.jpg"
                alt="Yonex Nanoflare 700 Pro Tournament Edition"
                fill
                priority
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-contain p-6 mix-blend-multiply drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out group-hover:scale-106 group-hover:rotate-[-1deg]"
              />
            </div>

            {/* Pro Spec HUD Chip 1 (Top Left): Model Badge */}
            <div className="absolute left-4 top-4 rounded-xl border border-line bg-card/95 px-3.5 py-2 shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-105">
              <span className="block text-[10px] font-black uppercase tracking-widest text-brand">FEATURED TOURNAMENT FRAME</span>
              <span className="text-xs font-extrabold text-ink">Nanoflare 700 Pro · 4U G5</span>
            </div>

            {/* Pro Spec HUD Chip 2 (Top Right): Tension Gauge */}
            <div className="absolute right-4 top-4 rounded-xl border border-line bg-card/95 px-3.5 py-2 shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-105">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted">MAX TENSION</span>
              <span className="text-xs font-black text-ink">28 – 32 LBS <span className="text-brand">⚡</span></span>
            </div>

            {/* Pro Spec HUD Chip 3 (Bottom Left): Flex & Balance */}
            <div className="absolute bottom-4 left-4 rounded-xl border border-line bg-card/95 px-3.5 py-2 shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-105">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold text-ink">Head Heavy · Stiff Carbon</span>
              </div>
              <span className="text-[10px] font-medium text-muted">Aero-Box Frame Technology</span>
            </div>

            {/* Pro Spec HUD Chip 4 (Bottom Right): Match Grade Stamp */}
            <div className="absolute bottom-4 right-4 rounded-xl border border-brand/40 bg-brand/5 px-3.5 py-2 shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-105">
              <span className="block text-[10px] font-black uppercase tracking-wider text-brand">MATCH TESTED</span>
              <span className="text-xs font-black text-ink">100% Genuine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
