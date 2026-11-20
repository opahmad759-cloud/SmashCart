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
                        <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-brand)_25%,var(--color-card)),var(--color-bg2))]">
                            {product.image && (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="object-contain p-8 mix-blend-multiply"
                                />
                            )}
                            {product.stock === 0 && (
                                <span className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-sm font-extrabold text-white">
                                    Out of stock
                                </span>
                            )}
                        </div>

                        {/* details */}
                        <div>
                            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">{product.brand}</span>
                            <h1 className="mb-2 mt-1 text-[clamp(28px,4vw,40px)] font-black leading-tight tracking-tight">{product.name}</h1>

                            <div className="text-sm text-[#F5B301]">
                                ★★★★★ <span className="text-muted">{product.rating} ({product.reviews} reviews)</span>
                            </div>

                            <div className="mt-4 text-3xl font-black">
                                Rs {product.price.toLocaleString()}
                                {product.oldPrice && (
                                    <span className="ml-2 text-lg font-medium text-muted line-through">Rs {product.oldPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-bold">
                                <span className="rounded-full border border-line bg-card px-3 py-1">{categoryNames[product.category] || product.category}</span>
                                <span className="rounded-full border border-line bg-card px-3 py-1">{product.level}</span>
                                <span
                                    className={`rounded-full px-3 py-1 ${product.stock === 0
                                        ? "bg-red-100 text-red-700"
                                        : product.stock <= 5
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {product.stock === 0
                                        ? "Out of stock"
                                        : product.stock <= 5
                                            ? `Only ${product.stock} left!`
                                            : `${product.stock} in stock`}
                                </span>
                            </div>

                            <p className="mt-5 max-w-130 text-muted">
                                {product.description || "Original product, checked before shipping. Pay on delivery anywhere in Pakistan."}
                            </p>

                            {/* quantity */}
                            <div className="mt-7 flex items-center gap-3">
                                <span className="text-sm font-bold">Quantity</span>
                                <div className="flex items-center rounded-xl border border-line bg-card">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 text-xl font-bold hover:text-brand">−</button>
                                    <span className="w-10 text-center font-bold">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        disabled={qty >= product.stock}
                                        className="h-10 w-10 text-xl font-bold hover:text-brand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-inherit"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-lg font-bold">
                                Total: <span className="text-brand">Rs {(product.price * qty).toLocaleString()}</span>
                            </p>

                            <button
                                onClick={handleAdd}
                                disabled={product.stock === 0}
                                className="mt-6 w-full rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {product.stock === 0 ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
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