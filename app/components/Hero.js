import Link from "next/link";

const stats = [
  { big: "200+", small: "Products" },
  { big: "4.9★", small: "Customer rating" },
  { big: "COD", small: "Pay on delivery" },
];

export default function Hero() {
  return (
    <section className="court-grid relative overflow-hidden bg-[radial-gradient(900px_420px_at_85%_10%,color-mix(in_srgb,var(--color-brand)_22%,transparent),transparent)] pb-17 pt-15">
      <div className="relative mx-auto grid max-w-295 items-center gap-8 px-5 md:grid-cols-[1.1fr_1fr]">
        {/* text */}
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-[13px] font-bold">
            <i className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_30%,transparent)]" />
            New season gear is here
          </span>
          <h1 className="mb-5 text-[clamp(40px,6.4vw,78px)] font-black leading-[0.98] tracking-[-0.035em]">
            Play harder.<br />Smash <em className="not-italic text-brand">louder.</em>
          </h1>
          <p className="mb-7 max-w-125 text-[19px] text-muted">
            Pro-level rackets, feather shuttles and court shoes for every player, from first rally to university champion.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="rounded-xl border-2 border-brand bg-brand px-6 py-3 font-extrabold text-white transition hover:-translate-y-0.75 hover:shadow-[0_14px_30px_-12px_var(--color-brand)]">
              Shop now →
            </Link>
            <Link href="/#why" className="rounded-xl border-2 border-line px-6 py-3 font-extrabold transition hover:-translate-y-0.75 hover:border-brand">
              Why SmashCart
            </Link>
          </div>
          <div className="mt-9 flex gap-9 border-t border-line pt-6">
            {stats.map((s) => (
              <div key={s.small}>
                <b className="block text-[28px] font-black">{s.big}</b>
                <span className="text-sm text-muted">{s.small}</span>
              </div>
            ))}
          </div>
        </div>

        {/* racket picture */}
        <div className="group relative mx-auto aspect-square w-full max-w-90 md:max-w-130">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-line" />
          <div className="absolute inset-[6%] rounded-full bg-[conic-gradient(from_200deg,var(--color-brand),color-mix(in_srgb,var(--color-brand)_30%,var(--color-bg)),var(--color-brand))]" />
          <svg
            viewBox="0 0 400 400"
            fill="none"
            className="absolute inset-0 h-full w-full -rotate-18 drop-shadow-[0_30px_30px_rgba(0,0,0,.3)] transition-transform duration-500 group-hover:-rotate-8 group-hover:scale-[1.03]"
          >
            <g transform="translate(200 190)">
              <ellipse cx="0" cy="-40" rx="78" ry="104" fill="#FAFAF7" fillOpacity=".7" className="stroke-ink" strokeWidth="9" />
              <g className="stroke-ink" strokeWidth="1.6" opacity=".55">
                <path d="M-62 -110V30M-42 -134V54M-21 -142V62M0 -144V64M21 -142V62M42 -134V54M62 -110V30" />
                <path d="M-70 -90H70M-76 -66H76M-78 -42H78M-76 -18H76M-70 6H70M-58 30H58M-40 52H40" />
              </g>
              <path d="M-26 62 L-12 108 H12 L26 62" className="stroke-ink" strokeWidth="9" strokeLinejoin="round" />
              <rect x="-10" y="106" width="20" height="108" rx="9" className="fill-ink" />
              <rect x="-10" y="150" width="20" height="14" className="fill-brand" />
              <rect x="-10" y="176" width="20" height="14" className="fill-brand" />
            </g>
          </svg>
          <div className="absolute left-0 top-[18%] rounded-2xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-bold shadow-[0_14px_30px_-14px_rgba(0,0,0,.4)]">
            ⚡ Fast delivery<small className="block font-medium text-muted">2–4 days nationwide</small>
          </div>
          <div className="absolute bottom-[16%] right-0 rounded-2xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-bold shadow-[0_14px_30px_-14px_rgba(0,0,0,.4)]">
            ✅ 100% original<small className="block font-medium text-muted">Checked before shipping</small>
          </div>
        </div>
      </div>
    </section>
  );
}