const items = [
    {
        title: "100% Genuine Match Equipment",
        text: "Directly sourced from authorized tournament distributors. Every racquet string tension and balance point is calibrated before dispatch.",
        badge: "VERIFIED AUTHENTIC",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-brand">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
    {
        title: "National Express Court Delivery",
        text: "Priority handling with protective corrugated racquet boxes and moisture-sealed shuttlecock packaging. Delivered across Pakistan in 2–4 days.",
        badge: "PRIORITY DISPATCH",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-brand">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
    },
    {
        title: "Cash On Delivery & Inspection",
        text: "Inspect your racquet and verify string integrity before paying at your doorstep. 7-day hassle-free equipment exchange guarantee.",
        badge: "RISK-FREE CHECKOUT",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-brand">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <circle cx="12" cy="15" r="2" />
            </svg>
        ),
    },
];

export default function Why() {
    return (
        <section id="why" className="py-18 border-b border-line">
            <div className="mx-auto max-w-295 px-5">
                <div className="max-w-160">
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                        THE SMASHCART STANDARD
                    </span>
                    <h2 className="mt-1 text-[clamp(28px,4vw,42px)] font-black uppercase tracking-tight text-ink">
                        BUILT FOR ATHLETES WHO DEMAND PERFECTION
                    </h2>
                    <p className="mt-1 text-base text-muted">
                        We play, test, and string badminton gear ourselves. Here is our tournament commitment to you.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {items.map((i) => (
                        <div key={i.title} className="group relative rounded-2xl border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-2 hover:border-brand/60 hover:shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand/15">
                                    {i.icon}
                                </div>
                                <span className="rounded bg-bg2 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-muted">
                                    {i.badge}
                                </span>
                            </div>
                            <b className="block text-lg font-black tracking-tight text-ink group-hover:text-brand transition-colors">{i.title}</b>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{i.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
