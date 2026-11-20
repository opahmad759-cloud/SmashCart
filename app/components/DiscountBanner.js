"use client";
import { useCart } from "../context/CartContext";

export default function DiscountBanner() {
    const { count, discountRate, settings } = useCart();
    if (count === 0) return null;

    const percent = Math.round(discountRate * 100);

    // the next discount level the customer can still reach
    let next = null;
    if (count < settings.tier1MinItems) {
        next = { need: settings.tier1MinItems - count, percent: settings.tier1Percent };
    } else if (count < settings.tier2MinItems) {
        next = { need: settings.tier2MinItems - count, percent: settings.tier2Percent };
    }
    if (next && next.percent <= percent) next = null; // only show a better discount

    if (percent === 0 && !next) return null;

    const more = next ? `Add ${next.need} more item${next.need === 1 ? "" : "s"} to get ${next.percent}% off` : "";

    let text;
    if (percent > 0 && next) text = `${percent}% off applied! ${more}`;
    else if (percent > 0) text = `${percent}% off applied on your whole order!`;
    else text = `${more}!`;

    return <div className="mb-6 rounded-xl bg-green-100 px-5 py-3.5 font-bold text-green-700">{text}</div>;
}