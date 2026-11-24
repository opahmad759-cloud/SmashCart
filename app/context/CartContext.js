"use client";
import { useAuth } from "./AuthContext";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "smashcart-cart";
const API = process.env.NEXT_PUBLIC_API_URL;

// used until the real settings load, or if they cannot be loaded
export const DEFAULT_SETTINGS = {
    deliveryFee: 300,
    freeDeliveryFrom: 10000,
    tier1MinItems: 2,
    tier1Percent: 5,
    tier2MinItems: 5,
    tier2Percent: 10,
};

// discount on the whole order, by the total number of items
export function getDiscountRate(totalItems, s = DEFAULT_SETTINGS) {
    if (totalItems >= s.tier2MinItems) return s.tier2Percent / 100;
    if (totalItems >= s.tier1MinItems) return s.tier1Percent / 100;
    return 0;
}

// bigger discount for the customer's very first order
export function getFirstOrderRate(totalItems) {
    if (totalItems < 1) return 0;
    if (totalItems >= 4) return 0.6;
    if (totalItems === 3) return 0.4;
    return 0.3;
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const { token } = useAuth();
    const [giftId, setGiftId] = useState(null);
    const [offer, setOffer] = useState({ isFirstOrder: false, giftFrom: 20000, giftChoices: [] });

    // 1) when the site opens, load the saved cart from the browser
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch {
            // ignore: the cart just starts empty
        }
        setLoaded(true);
    }, []);

    // 2) every time the cart changes, save it (but not before the first load)
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items, loaded]);

    // 3) load the shop settings (delivery fee, discounts) from the API
    useEffect(() => {
        fetch(`${API}/api/settings`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((s) => setSettings({ ...DEFAULT_SETTINGS, ...s }))
            .catch(() => {
                // keep the defaults
            })
            .finally(() => setSettingsLoaded(true));
    }, []);

    // 4) ask the server if the next order is this customer's first order
    useEffect(() => {
        if (!token) {
            setOffer((o) => ({ ...o, isFirstOrder: false }));
            return;
        }
        fetch(`${API}/api/orders/offer`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => setOffer(data))
            .catch(() => {
                // keep the normal discount
            });
    }, [token, items.length]);

    function addToCart(product, qty = 1) {
        const stock = product.stock ?? 99;
        setItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                // already in the cart: increase the quantity (never above the stock)
                return prev.map((i) =>
                    i._id === product._id ? { ...i, qty: Math.min(stock, i.qty + qty) } : i
                );
            }
            // new item: save only what the cart needs
            return [
                ...prev,
                {
                    _id: product._id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    stock,
                    qty: Math.min(stock, qty),
                },
            ];
        });
    }

    function changeQty(id, qty) {
        setItems((prev) =>
            prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(i.stock, qty)) } : i))
        );
    }

    function removeFromCart(id) {
        setItems((prev) => prev.filter((i) => i._id !== id));
    }

    function clearCart() {
        setItems([]);
    }

    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const discountRate = offer.isFirstOrder ? getFirstOrderRate(count) : getDiscountRate(count, settings);
    const discount = Math.round(total * discountRate);
    const afterDiscount = total - discount;
    const delivery = items.length === 0 || afterDiscount >= settings.freeDeliveryFrom ? 0 : settings.deliveryFee;
    const grandTotal = afterDiscount + delivery;
    const giftEarned = !!token && !offer.isFirstOrder && afterDiscount >= offer.giftFrom;
    const giftChoices = offer.giftChoices || [];
    const gift = giftEarned ? giftChoices.find((g) => g._id === giftId) || null : null;

    return (
        <CartContext.Provider
            value={{ items, count, total, discountRate, discount, delivery, grandTotal, giftEarned, giftChoices, gift, setGiftId, offer, isLoggedIn: !!token, settings, settingsLoaded, loaded, addToCart, changeQty, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}