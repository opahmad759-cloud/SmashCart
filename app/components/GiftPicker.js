"use client";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function GiftPicker() {
    const { giftEarned, giftChoices, gift, setGiftId } = useCart();
    if (!giftEarned || giftChoices.length === 0) return null;

    return (
        <div className="mb-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
            <h2 className="text-lg font-black">🎁 Choose your free gift</h2>
            <p className="mb-3 text-sm text-muted">Pick one shuttle. It is free with this order.</p>
            <div className="grid gap-3">
                {giftChoices.map((g) => {
                    const picked = gift?._id === g._id;
                    return (
                        <button
                            type="button"
                            key={g._id}
                            onClick={() => setGiftId(g._id)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card p-3 text-left transition ${picked ? "border-brand" : "border-line hover:border-brand/50"}`}
                        >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg2">
                                {g.image && <Image src={g.image} alt={g.name} fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold">{g.name}</p>
                                <p className="text-xs text-muted">{g.brand} · worth Rs {g.price.toLocaleString()}</p>
                            </div>
                            {picked && <span className="font-black text-brand">✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}