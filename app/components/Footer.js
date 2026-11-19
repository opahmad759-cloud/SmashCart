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
        <footer className="border-t border-line pb-7 pt-11 text-sm text-muted">
            <div className="mx-auto max-w-295 px-5">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <div className="text-2xl font-black tracking-tight text-ink">Smash<span className="text-brand">Cart</span></div>
                        <p className="mt-2.5 max-w-70">Badminton gear from a player who plays every Saturday.</p>
                    </div>
                    {cols.map((c) => (
                        <div key={c.title}>
                            <b className="mb-2.5 block text-ink">{c.title}</b>
                            {c.links.map((l) => (
                                <Link key={l.label} href={l.href} className="my-1.5 block hover:text-brand">{l.label}</Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-7 border-t border-line pt-4.5">© 2026 SmashCart · Sample project by Ahmad Mehboob</div>
            </div>
        </footer>
    );
}