const reviews = [
    { stars: "★★★★★", text: "Got my first proper racket here. Light, fast, and delivered in 3 days.", who: "Hamza, university player" },
    { stars: "★★★★★", text: "The shoe guide helped me pick the right size. Great grip on the court.", who: "Ayesha, club member" },
    { stars: "★★★★☆", text: "Feather shuttles are original and last longer. Will order again.", who: "Bilal, Saturday regular" },
];

export default function Reviews() {
    return (
        <section id="about" className="pb-17">
            <div className="mx-auto max-w-295 px-5">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Players say</p>
                <h2 className="my-1.5 text-[clamp(28px,4vw,42px)] font-black tracking-tight">Loved on the court</h2>
                <p className="mb-7 text-[17px] text-muted">Sample reviews with made-up names.</p>
                <div className="grid gap-5 md:grid-cols-3">
                    {reviews.map((r) => (
                        <blockquote key={r.who} className="rounded-[20px] border border-line bg-card p-6">
                            <div className="text-[13px] text-[#F5B301]">{r.stars}</div>
                            <p className="my-2.5 mb-3.5">“{r.text}”</p>
                            <cite className="text-sm not-italic text-muted">{r.who}</cite>
                        </blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
}