import { brands } from "../data/products";

export default function BrandStrip() {
    const row = [...brands, ...brands]; // doubled so the loop has no gap
    return (
        <div className="overflow-hidden border-y border-line bg-bg2 py-4.5">
            <div className="marquee-track gap-15 text-[22px] font-black tracking-[0.08em] text-muted/80" style={{ "--dur": "28s" }}>
                {[...row, ...row].map((b, i) => (
                    <span key={i} className="mr-15">{b}</span>
                ))}
            </div>
        </div>
    );
}