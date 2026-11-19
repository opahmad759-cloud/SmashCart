"use client";
import { useState } from "react";
import { products, tabs } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductMarquee() {
    const [active, setActive] = useState("all");

    const list = active === "all" ? products : products.filter((p) => p.category === active);
    // repeat until there are at least 8 cards, then double it so the loop is seamless
    let base = [];
    while (base.length < 8) base = base.concat(list);
    const row = [...base, ...base];

    return (
        <section id="products" className="py-17">
            <div className="mx-auto flex max-w-295 flex-wrap items-end justify-between gap-5 px-5">
                <div>
                    <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Best sellers</p>
                    <h2 className="my-1.5 text-[clamp(28px,4vw,42px)] font-black tracking-tight">Trending now</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActive(t.key)}
                            className={`rounded-full border px-4.5 py-2 text-sm font-bold transition ${active === t.key ? "border-brand bg-brand text-white" : "border-line bg-card text-muted hover:border-brand hover:text-ink"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="marquee-pause mt-5.5 overflow-hidden py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
                <div className="marquee-track" style={{ "--dur": `${base.length * 5}s` }}>
                    {row.map((p, i) => (
                        <ProductCard key={`${p.id}-${i}`} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}