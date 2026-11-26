"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { tabs } from "../data/products";

const API = process.env.NEXT_PUBLIC_API_URL;

const brandOptions = ["Yonex", "Li-Ning", "Victor", "ASICS", "Kumpoo", "UVO"];
const levelOptions = ["Beginner", "Intermediate", "Advanced", "All levels"];
const priceOptions = [
    { label: "Any price", value: "" },
    { label: "Under Rs 5,000", value: "5000" },
    { label: "Under Rs 10,000", value: "10000" },
    { label: "Under Rs 20,000", value: "20000" },
    { label: "Under Rs 50,000", value: "50000" },
];

const selectClass = "rounded-xl border border-line bg-card px-4 py-2.5 text-xs font-bold outline-none transition focus:border-brand shadow-xs";

function ProductsContent() {
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [brand, setBrand] = useState("");
    const [level, setLevel] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // when a navbar link changes ?category=..., update the category button
    useEffect(() => {
        setCategory(searchParams.get("category") || "all");
    }, [searchParams]);

    // ask the API again whenever a filter changes
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (category !== "all") params.set("category", category);
        if (brand) params.set("brand", brand);
        if (level) params.set("level", level);
        if (maxPrice) params.set("maxPrice", maxPrice);

        fetch(`${API}/api/products?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setProducts(data);
            })
            .catch(() => {
                if (!cancelled) setError("Could not load products. Is the API running?");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [category, brand, level, maxPrice]);

    function clearFilters() {
        setCategory("all");
        setBrand("");
        setLevel("");
        setMaxPrice("");
    }

    return (
        <main className="mx-auto max-w-295 px-5 py-12">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                OFFICIAL CATALOGUE
            </span>
            <h1 className="mt-1 text-[clamp(32px,4vw,46px)] font-black uppercase tracking-tight text-ink">
                TOURNAMENT GEAR & EQUIPMENT
            </h1>
            <p className="mt-1 text-base text-muted max-w-160">
                Filter through championship-spec racquets, BWF match shuttlecocks, and court footwear.
            </p>

            {/* category buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setCategory(t.key)}
                        className={`rounded-xl border px-4.5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 ${category === t.key
                            ? "border-brand bg-brand text-white shadow-md shadow-brand/20"
                            : "border-line bg-card text-muted hover:border-brand/60 hover:text-ink hover:-translate-y-0.5"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* brand, level, price */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
                    <option value="">All brands</option>
                    {brandOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>

                <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
                    <option value="">All levels</option>
                    {levelOptions.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>

                <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectClass}>
                    {priceOptions.map((p) => (
                        <option key={p.label} value={p.value}>{p.label}</option>
                    ))}
                </select>

                <button onClick={clearFilters} className="text-xs font-black uppercase tracking-wider text-brand hover:underline">
                    Clear filters
                </button>
            </div>

            <p className="mb-6 mt-6 text-xs font-bold uppercase tracking-wider text-muted">
                {loading ? "Loading match equipment..." : `${products.length} product${products.length === 1 ? "" : "s"} found`}
            </p>

            {error && <p className="font-semibold text-brand">{error}</p>}

            {!loading && !error && products.length === 0 && (
                <p className="rounded-xl border border-line bg-card p-6 text-muted">No products match these tournament filters.</p>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                    <div key={p._id} className="[&>div]:mr-0 [&>div]:w-full">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default function ProductsPage() {
    return (
        <>
            <Navbar />
            {/* Suspense is required by Next.js when a page uses useSearchParams */}
            <Suspense fallback={<p className="mx-auto max-w-295 px-5 py-12 text-muted">Loading...</p>}>
                <ProductsContent />
            </Suspense>
            <Footer />
        </>
    );
}