const items = [
    { icon: "✅", title: "Original products", text: "Every racket and shoe is checked before it ships." },
    { icon: "🚚", title: "Fast delivery", text: "Delivery across Pakistan in a few days." },
    { icon: "💵", title: "Cash on delivery", text: "Pay when your order arrives. No card needed." },
];

export default function Why() {
    return (
        <section id="why" className="pb-17">
            <div className="mx-auto max-w-295 px-5">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Why SmashCart</p>
                <h2 className="my-1.5 text-[clamp(28px,4vw,42px)] font-black tracking-tight">Shop with confidence</h2>
                <p className="mb-7 text-[17px] text-muted">Simple promises we keep.</p>
                <div className="grid gap-5 md:grid-cols-3">
                    {items.map((i) => (
                        <div key={i.title} className="rounded-[20px] border border-line bg-card p-7">
                            <div className="mb-3.5 flex h-13 w-13 items-center justify-center rounded-2xl bg-brand/15 text-2xl">{i.icon}</div>
                            <b className="text-[19px]">{i.title}</b>
                            <p className="mt-1.5 text-muted">{i.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}