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

const selectClass = "rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-brand";

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
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Shop</p>
            <h1 className="my-1.5 text-[clamp(30px,4vw,44px)] font-black tracking-tight">All products</h1>

            {/* category buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setCategory(t.key)}
                        className={`rounded-full border px-4.5 py-2 text-sm font-bold transition ${category === t.key ? "border-brand bg-brand text-white" : "border-line bg-card text-muted hover:border-brand hover:text-ink"
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

                <button onClick={clearFilters} className="text-sm font-bold text-brand hover:underline">
                    Clear filters
                </button>
            </div>

            <p className="mb-6 mt-6 text-sm text-muted">
                {loading ? "Loading..." : `${products.length} product${products.length === 1 ? "" : "s"} found`}
            </p>

            {error && <p className="font-semibold text-brand">{error}</p>}

            {!loading && !error && products.length === 0 && (
                <p className="rounded-xl border border-line bg-card p-6 text-muted">No products match these filters.</p>
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