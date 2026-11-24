"use client";
import { useCart } from "../context/CartContext";

export default function DiscountBanner() {
    const { count, total, discount, discountRate, settings, offer, isLoggedIn } = useCart();
    if (count === 0) return null;

    const percent = Math.round(discountRate * 100);
    const afterDiscount = total - discount;

    // the next discount level the customer can still reach
    let next = null;
    if (offer.isFirstOrder) {
        if (count < 3) next = { need: 3 - count, percent: 40 };
        else if (count < 4) next = { need: 4 - count, percent: 60 };
    } else if (count < settings.tier1MinItems) {
        next = { need: settings.tier1MinItems - count, percent: settings.tier1Percent };
    } else if (count < settings.tier2MinItems) {
        next = { need: settings.tier2MinItems - count, percent: settings.tier2Percent };
    }
    if (next && next.percent <= percent) next = null; // only show a better discount

    const more = next ? `Add ${next.need} more item${next.need === 1 ? "" : "s"} to get ${next.percent}% off` : "";
    const prefix = offer.isFirstOrder ? "First order offer: " : "";

    let text = "";
    if (percent > 0 && next) text = `${prefix}${percent}% off applied! ${more}`;
    else if (percent > 0) text = `${prefix}${percent}% off applied on your whole order!`;
    else if (next) text = `${more}!`;

    // gift for returning customers
    let giftText = "";
    if (isLoggedIn && !offer.isFirstOrder && (offer.giftChoices || []).length > 0) {
        giftText =
            afterDiscount >= offer.giftFrom
                ? "🎁 You get a free shuttle with this order! Choose it below."
                : `Spend Rs ${(offer.giftFrom - afterDiscount).toLocaleString()} more to get a free shuttle of your choice!`;
    }

    if (!text && !giftText) return null;

    return (
        <div className="mb-6 space-y-2">
            {text && <div className="rounded-xl bg-green-100 px-5 py-3.5 font-bold text-green-700">{text}</div>}
            {giftText && <div className="rounded-xl bg-amber-100 px-5 py-3.5 font-bold text-amber-700">{giftText}</div>}
        </div>
    );
}