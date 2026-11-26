const reviews = [
    {
        stars: "★★★★★",
        text: "The Nanoflare 700 Pro came with genuine Yonex BG80 stringing at 28 lbs tension as requested. Smash feel is crisp, frame is 100% authentic.",
        who: "Hamza Tariq",
        role: "National Ranking Player · Punjab",
        highlight: "Verified Tournament Purchase",
    },
    {
        stars: "★★★★★",
        text: "Ordered ASICS Gel-Rocket 11. Grip on synthetic wooden courts is unbelievable, zero heel slippage. Delivered to Lahore in under 48 hours.",
        who: "Ayesha Malik",
        role: "Varsity Badminton Captain",
        highlight: "Verified Court Shoe Purchase",
    },
    {
        stars: "★★★★★",
        text: "Victor Master Ace feather shuttles hold their flight trajectory through multiple heavy smash rallies without feather breakage. Outstanding grade.",
        who: "Bilal Sheikh",
        role: "Club League Regular",
        highlight: "Verified Match Shuttle Purchase",
    },
];

export default function Reviews() {
    return (
        <section id="about" className="py-18">
            <div className="mx-auto max-w-295 px-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                            TESTED ON COURT
                        </span>
                        <h2 className="mt-1 text-[clamp(28px,4vw,42px)] font-black uppercase tracking-tight text-ink">
                            TRUSTED BY TOURNAMENT PLAYERS
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2 shadow-xs">
                        <span className="text-sm font-black text-ink">4.9 / 5.0</span>
                        <span className="text-amber-500 text-xs">★★★★★</span>
                        <span className="text-xs font-bold text-muted border-l border-line pl-2">2,400+ Verified Matches</span>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {reviews.map((r) => (
                        <blockquote key={r.who} className="group rounded-2xl border border-line bg-card p-6.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-lg flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xs font-black tracking-widest text-amber-500">{r.stars}</div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                    {r.highlight}
                                </span>
                            </div>
                            <p className="my-2 text-[15px] leading-relaxed text-ink/90 font-medium italic">“{r.text}”</p>
                            <div className="mt-auto pt-4 border-t border-line/60">
                                <b className="block text-sm font-black text-ink">{r.who}</b>
                                <cite className="text-xs not-italic font-semibold text-muted block">{r.role}</cite>
                            </div>
                        </blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
}
