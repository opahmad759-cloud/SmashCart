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
        <section id="products" className="py-18 bg-bg2/40 border-b border-line">
            <div className="mx-auto flex max-w-295 flex-wrap items-end justify-between gap-6 px-5">
                <div>
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse"></span>
                        MATCH-READY GEAR
                    </span>
                    <h2 className="mt-1 text-[clamp(28px,4vw,42px)] font-black uppercase tracking-tight text-ink">
                        OFFICIAL TOURNAMENT EQUIPMENT
                    </h2>
                    <p className="mt-1 text-sm font-medium text-muted">
                        Certified racquets, shuttles, and court footwear chosen by international athletes.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActive(t.key)}
                            className={`rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 ${active === t.key
                                ? "border-brand bg-brand text-white shadow-md shadow-brand/20"
                                : "border-line bg-card text-muted hover:border-brand/60 hover:text-ink hover:-translate-y-0.5"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="marquee-pause mt-7 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
                <div className="marquee-track" style={{ "--dur": `${base.length * 4.5}s` }}>
                    {row.map((p, i) => (
                        <ProductCard key={`${p.id}-${i}`} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
