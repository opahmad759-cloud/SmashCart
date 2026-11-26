import { brands } from "../data/products";

export default function BrandStrip() {
    const row = [...brands, ...brands]; // doubled so the loop has no gap
    return (
        <div className="overflow-hidden border-b border-line bg-card py-4">
            <div className="mx-auto max-w-295 px-5 mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted">
                <span>OFFICIAL EQUIPMENT & TOUR PARTNERS</span>
                <span className="hidden sm:inline text-brand">BWF CERTIFIED SUPPLIERS</span>
            </div>
            <div className="marquee-track gap-14 text-[20px] font-black uppercase tracking-[0.18em] text-ink/75 transition-colors" style={{ "--dur": "24s" }}>
                {[...row, ...row].map((b, i) => (
                    <span key={i} className="mr-14 flex items-center gap-3 transition-colors hover:text-brand cursor-default">
                        <span>{b}</span>
                        <span className="h-1 w-1 rounded-full bg-brand/50"></span>
                    </span>
                ))}
            </div>
        </div>
    );
}
