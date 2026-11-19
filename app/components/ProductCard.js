"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { _id, name, brand, level, price, oldPrice, tag, emoji, image, rating, reviews } = product;

    // products from the API have an _id; the home page sample data does not
    const href = _id ? `/products/${_id}` : "/products";

    return (
        <div className="mr-5 flex w-67.5 shrink-0 flex-col overflow-hidden rounded-[20px] border border-line bg-card transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_24px_50px_-24px_var(--color-brand)]">
            <Link href={href} className="block">
                <div className="relative flex aspect-[1/0.9] items-center justify-center bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-brand)_25%,var(--color-card)),var(--color-bg2))] text-7xl">
                    {tag && <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-2.5 py-0.5 text-xs font-extrabold text-white">{tag}</span>}
                    <span className="absolute right-3 top-3 z-10 rounded-full border border-line bg-card px-2.5 py-0.5 text-[11px] font-bold">{level}</span>
                    {image ? (
                        <Image src={image} alt={name} fill sizes="270px" className="object-contain p-5 mix-blend-multiply" />
                    ) : (
                        emoji
                    )}
                </div>
            </Link>
            <div className="flex flex-1 flex-col gap-1 p-4.5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand">{brand}</span>
                <h3 className="text-lg font-semibold">
                    <Link href={href} className="hover:text-brand">{name}</Link>
                </h3>
                <div className="text-[13px] text-[#F5B301]">★★★★★ <span className="text-muted">{rating} ({reviews})</span></div>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-xl font-black">
                        Rs {price.toLocaleString()}
                        {oldPrice && <span className="ml-1.5 text-[13px] font-medium text-muted line-through">Rs {oldPrice.toLocaleString()}</span>}
                    </span>
                    {_id ? (
                        <button
                            onClick={() => addToCart(product)}
                            aria-label={`Add ${name} to cart`}
                            className="h-10.5 w-10.5 rounded-xl bg-brand text-[22px] font-black text-white transition hover:rotate-6 hover:scale-110"
                        >
                            +
                        </button>
                    ) : (
                        <Link
                            href="/products"
                            aria-label="See all products"
                            className="flex h-10.5 w-10.5 items-center justify-center rounded-xl bg-brand text-[22px] font-black text-white transition hover:rotate-6 hover:scale-110"
                        >
                            +
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}