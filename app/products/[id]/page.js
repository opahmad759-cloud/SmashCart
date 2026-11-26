"use client";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const categoryNames = { racket: "Rackets", shuttle: "Shuttlecocks", shoes: "Shoes", bag: "Bags" };

function ProductDetailContent() {
    const { id } = useParams(); // the [id] part of the URL
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("not found");
                return res.json();
            })
            .then((data) => setProduct(data))
            .catch(() => setError("Product not found."))
            .finally(() => setLoading(false));
    }, [id]);

    function handleAdd() {
        addToCart(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-295 px-5 py-10">
                <Link href="/products" className="text-sm font-bold text-muted hover:text-brand">
                    ← Back to products
                </Link>

                {loading && <p className="mt-8 text-muted">Loading...</p>}
                {error && <p className="mt-8 font-semibold text-brand">{error}</p>}

                {product && (
                    <div className="mt-6 grid gap-10 md:grid-cols-2">
                        {/* photo */}
                        <div className="group relative aspect-square overflow-hidden rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-brand)_15%,var(--color-card)),var(--color-bg2))]">
                            {product.image && (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="object-contain p-8 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-106"
                                />
                            )}
                            {product.stock === 0 && (
                                <span className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-sm font-extrabold text-white shadow-xs">
                                    Out of stock
                                </span>
                            )}
                        </div>

                        {/* details */}
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-brand">{product.brand}</span>
                                <span className="text-muted/60">•</span>
                                <span className="text-[11px] font-black uppercase tracking-wider text-muted">2026 Pro Series</span>
                            </div>

                            <h1 className="mb-2 text-[clamp(28px,4vw,42px)] font-black uppercase leading-tight tracking-tight text-ink">{product.name}</h1>

                            <div className="flex items-center gap-2 text-sm text-[#F5B301]">
                                ★★★★★ <span className="text-xs font-bold text-muted">{product.rating} ({product.reviews} tournament reviews)</span>
                            </div>

                            <div className="mt-4 flex items-baseline gap-3">
                                <span className="text-3xl font-black tracking-tight text-ink">Rs {product.price.toLocaleString()}</span>
                                {product.oldPrice && (
                                    <span className="text-lg font-semibold text-muted line-through">Rs {product.oldPrice.toLocaleString()}</span>
                                )}
                                <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-black text-brand uppercase">Official Price</span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider">
                                <span className="rounded-lg border border-line bg-card px-3 py-1.5">{categoryNames[product.category] || product.category}</span>
                                <span className="rounded-lg border border-line bg-card px-3 py-1.5">{product.level}</span>
                                <span
                                    className={`rounded-lg px-3 py-1.5 ${product.stock === 0
                                        ? "bg-red-100 text-red-700"
                                        : product.stock <= 5
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-emerald-100 text-emerald-800"
                                        }`}
                                >
                                    {product.stock === 0
                                        ? "Out of stock"
                                        : product.stock <= 5
                                            ? `Only ${product.stock} left!`
                                            : `${product.stock} units ready to dispatch`}
                                </span>
                            </div>

                            <p className="mt-5 max-w-135 leading-relaxed text-muted text-[15px]">
                                {product.description || "Original tournament equipment, calibrated and string-checked before shipping. Inspect before paying at your doorstep anywhere in Pakistan."}
                            </p>

                            {/* Pro Tournament Specifications Grid */}
                            <div className="mt-6 rounded-2xl border border-line bg-bg2/50 p-4.5 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="block font-bold text-muted uppercase text-[10px] tracking-wider">Grade Standard</span>
                                    <b className="text-ink font-black">BWF Approved Spec</b>
                                </div>
                                <div>
                                    <span className="block font-bold text-muted uppercase text-[10px] tracking-wider">Dispatch Handling</span>
                                    <b className="text-ink font-black">Dispatched in 24 Hours</b>
                                </div>
                                <div>
                                    <span className="block font-bold text-muted uppercase text-[10px] tracking-wider">Packaging</span>
                                    <b className="text-ink font-black">Shock-Resistant Box</b>
                                </div>
                                <div>
                                    <span className="block font-bold text-muted uppercase text-[10px] tracking-wider">Payment Method</span>
                                    <b className="text-ink font-black">Cash On Delivery Available</b>
                                </div>
                            </div>

                            {/* quantity */}
                            <div className="mt-7 flex items-center gap-4">
                                <span className="text-xs font-black uppercase tracking-wider text-muted">Quantity:</span>
                                <div className="flex items-center rounded-xl border border-line bg-card shadow-xs">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 text-xl font-bold transition-transform active:scale-90 hover:text-brand">−</button>
                                    <span className="w-10 text-center font-black">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        disabled={qty >= product.stock}
                                        className="h-10 w-10 text-xl font-bold transition-transform active:scale-90 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-inherit"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm font-bold text-muted">
                                    Total: <b className="text-ink text-base">Rs {(product.price * qty).toLocaleString()}</b>
                                </span>
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={product.stock === 0}
                                className={`mt-6 w-full rounded-xl px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${added ? "bg-emerald-600 shadow-emerald-600/30 scale-102" : "bg-brand shadow-brand/25 hover:-translate-y-0.75 hover:shadow-xl hover:shadow-brand/35"
                                    }`}
                            >
                                {product.stock === 0 ? "Out of stock" : added ? "Added to bag ✓" : "Add to tournament bag →"}
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
export default function ProductDetailPage() {
    return (
        <Suspense fallback={<p className="p-10 text-muted">Loading...</p>}>
            <ProductDetailContent />
        </Suspense>
    );
}