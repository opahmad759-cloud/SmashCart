"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "smashcart-cart";

const FREE_DELIVERY_OVER = 10000;
const DELIVERY_FEE = 300;

// discount on the whole order, by the total number of items
export function getDiscountRate(totalItems) {
    if (totalItems >= 5) return 0.1; // 5 or more items: 10%
    if (totalItems >= 2) return 0.05; // 2 to 4 items: 5%
    return 0; // less than 2 items: no discount
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);

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

    const discountRate = getDiscountRate(count);
    const discount = Math.round(total * discountRate);
    const afterDiscount = total - discount;
    const delivery = items.length === 0 || afterDiscount >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
    const grandTotal = afterDiscount + delivery;

    return (
        <CartContext.Provider value={{ items, count, total, discountRate, discount, delivery, grandTotal, loaded, addToCart, changeQty, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}