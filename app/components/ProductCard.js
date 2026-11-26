"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { _id, name, brand, level, price, oldPrice, tag, emoji, image, rating, reviews, stock, category } = product;

    // products from the API have an _id; the home page sample data does not
    const href = _id ? `/products/${_id}` : "/products";

    // the home page sample data has no stock, so it is never "sold out"
    const soldOut = stock === 0;

    // Quick badminton spec tag helper
    const specTag = category === "racket"
        ? "4U · 28-30 LBS"
        : category === "shuttle"
            ? "SPEED 77 · GOOSE"
            : category === "shoes"
                ? "NON-MARKING GRIP"
                : "PRO SERIES";

    return (
        <div className="group mr-5 flex w-70 shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:-translate-y-2 hover:border-brand/70 hover:shadow-[0_22px_44px_-16px_rgba(229,37,56,0.22)]">
            <Link href={href} className="block overflow-hidden relative">
                <div className="relative flex aspect-[1/0.92] items-center justify-center bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-brand)_12%,var(--color-card)),var(--color-bg2))] text-7xl transition-colors duration-300">
                    {/* Badge: Tag or Discount */}
                    {tag && (
                        <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
                            {tag}
                        </span>
                    )}

                    {/* Badge: Level */}
                    <span className="absolute right-3 top-3 z-10 rounded-md border border-line bg-card/95 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink backdrop-blur-xs">
                        {level}
                    </span>

                    {/* Stock status overlay */}
                    {soldOut && (
                        <span className="absolute bottom-3 left-3 z-10 rounded-md bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                            Out of stock
                        </span>
                    )}

                    {/* Spec badge overlay */}
                    <span className="absolute bottom-3 right-3 z-10 rounded-md border border-line bg-card/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted backdrop-blur-xs">
                        {specTag}
                    </span>

                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="280px"
                            className={`object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108 ${soldOut ? "opacity-40" : ""}`}
                        />
                    ) : (
                        <span className="transition-transform duration-300 group-hover:scale-110">{emoji}</span>
                    )}
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4.5">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand">{brand}</span>
                    <span className="text-[11px] font-bold text-muted">⭐ {rating} <span className="text-muted/70">({reviews})</span></span>
                </div>

                <h3 className="text-base font-extrabold tracking-tight line-clamp-1">
                    <Link href={href} className="transition-colors duration-200 hover:text-brand">{name}</Link>
                </h3>

                <div className="mt-auto flex items-center justify-between pt-3.5 border-t border-line/70">
                    <div>
                        <span className="text-[11px] block font-bold uppercase tracking-wider text-muted">Match Price</span>
                        <span className="text-lg font-black tracking-tight text-ink">
                            Rs {price.toLocaleString()}
                            {oldPrice && <span className="ml-1.5 text-xs font-semibold text-muted line-through">Rs {oldPrice.toLocaleString()}</span>}
                        </span>
                    </div>

                    {_id ? (
                        <button
                            onClick={() => addToCart(product)}
                            disabled={soldOut}
                            aria-label={soldOut ? `${name} is out of stock` : `Add ${name} to cart`}
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-xs font-black uppercase tracking-wider text-white transition-all duration-200 hover:bg-brand hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                        >
                            <span>+</span>
                            <span>Bag</span>
                        </button>
                    ) : (
                        <Link
                            href="/products"
                            aria-label="See all products"
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-xs font-black uppercase tracking-wider text-white transition-all duration-200 hover:bg-brand hover:scale-105 active:scale-95"
                        >
                            <span>+</span>
                            <span>Bag</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
