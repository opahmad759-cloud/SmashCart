import Link from "next/link";

const cols = [
    {
        title: "Shop",
        links: [
            { label: "Rackets", href: "/products?category=racket" },
            { label: "Shuttlecocks", href: "/products?category=shuttle" },
            { label: "Shoes", href: "/products?category=shoes" },
        ],
    },
    {
        title: "Help",
        links: [
            { label: "Shipping", href: "#" },
            { label: "Returns", href: "#" },
            { label: "FAQ", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/about#contact" },
            { label: "Privacy", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-line bg-card/60 pb-8 pt-14 text-sm text-muted">
            <div className="mx-auto max-w-295 px-5">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-ink">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white text-xs">🏸</span>
                            <span>Smash<span className="text-brand">Cart</span></span>
                            <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-black text-white">PRO</span>
                        </div>
                        <p className="mt-3 max-w-75 text-sm leading-relaxed text-muted">
                            Pakistan&apos;s specialized badminton destination for tournament racquets, authentic goose shuttles, and court-grip footwear.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider text-ink">
                            <span className="rounded-md border border-line bg-bg px-2.5 py-1">COD Nationwide</span>
                            <span className="rounded-md border border-line bg-bg px-2.5 py-1">24H Dispatch</span>
                            <span className="rounded-md border border-line bg-bg px-2.5 py-1">100% Genuine</span>
                        </div>
                    </div>
                    {cols.map((c) => (
                        <div key={c.title}>
                            <b className="mb-3 block text-xs font-black uppercase tracking-widest text-ink">{c.title}</b>
                            {c.links.map((l) => (
                                <Link key={l.label} href={l.href} className="my-2 block text-xs font-semibold text-muted transition hover:text-brand">{l.label}</Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
                    <div>© 2026 SmashCart Pro Badminton · Engineered for Supreme Velocity</div>
                    <div className="flex gap-4 font-semibold">
                        <span>BWF Tournament Certified Gear</span>
                        <span>·</span>
                        <span>Official Partner Store</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}