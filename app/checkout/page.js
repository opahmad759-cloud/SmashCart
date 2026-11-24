"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import GiftPicker from "../components/GiftPicker";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, count, total, discountRate, discount, delivery, grandTotal, giftEarned, giftChoices, gift, clearCart } = useCart();
    const { user, token, loaded, logout } = useAuth();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [placed, setPlaced] = useState(false);

    // fill in the name from the account (once)
    useEffect(() => {
        if (user) setFullName((current) => current || user.name);
    }, [user]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (giftEarned && giftChoices.length > 0 && !gift) throw new Error("Please choose your free gift");
            const res = await fetch(`${API}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    // only ids and quantities: the server reads the prices itself
                    items: items.map((i) => ({ productId: i._id, qty: i.qty })),
                    giftProductId: gift ? gift._id : undefined,
                    shipping: { fullName, phone, address, city },
                }),
            });
            const data = await res.json();

            if (res.status === 401) {
                logout();
                throw new Error("Your session has expired. Please log in again.");
            }
            if (!res.ok) throw new Error(data.message || "Something went wrong");

            setPlaced(true); // so the page does not flash "cart is empty"
            clearCart();
            router.push(`/order-success/${data._id}`);
        } catch (err) {
            setError(err.message === "Failed to fetch" ? "Cannot reach the server. Is the API running?" : err.message);
        } finally {
            setLoading(false);
        }
    }

    let content;

    if (!loaded) {
        content = <p className="text-muted">Loading...</p>;
    } else if (!user) {
        content = (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="text-lg font-semibold">Please log in to place your order</p>
                <p className="mt-1 text-muted">Your cart will be waiting for you.</p>
                <div className="mt-5 flex justify-center gap-3">
                    <Link href="/login" className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white">Log in</Link>
                    <Link href="/signup" className="rounded-xl border border-line px-6 py-3 font-extrabold">Sign up</Link>
                </div>
            </div>
        );
    } else if (placed) {
        content = <p className="text-muted">Placing your order...</p>;
    } else if (items.length === 0) {
        content = (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="text-lg font-semibold">Your cart is empty</p>
                <Link href="/products" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 font-extrabold text-white">
                    Shop products
                </Link>
            </div>
        );
    } else {
        content = (
            <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                {/* delivery details */}
                <div className="rounded-2xl border border-line bg-card p-6">
                    <h2 className="mb-4 text-xl font-black">Delivery details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Full name</label>
                            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Phone number</label>
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Address</label>
                            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, street, area" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">City</label>
                            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lahore" className={inputClass} />
                        </div>
                    </div>

                    <h2 className="mb-3 mt-7 text-xl font-black">Payment</h2>
                    <div className="flex items-center gap-3 rounded-xl border-2 border-brand bg-brand/5 px-4 py-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand">
                            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                        </span>
                        <div>
                            <b>Cash on delivery</b>
                            <p className="text-sm text-muted">Pay when your order arrives.</p>
                        </div>
                    </div>
                </div>

                {/* summary */}
                <aside className="rounded-2xl border border-line bg-card p-6 lg:sticky lg:top-24">
                    <h2 className="mb-4 text-xl font-black">Your order</h2>

                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item._id} className="flex items-center gap-3">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg2">
                                    {item.image && <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{item.name}</p>
                                    <p className="text-xs text-muted">Qty {item.qty}</p>
                                </div>
                                <b className="text-sm">Rs {(item.price * item.qty).toLocaleString()}</b>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4"><GiftPicker /></div>
                    <div className="mt-4 border-t border-line pt-3">
                        <div className="flex justify-between py-1 text-muted">
                            <span>Subtotal</span>
                            <span>Rs {total.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between py-1 font-semibold text-green-600">
                                <span>Quantity discount</span>
                                <span>− Rs {discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between py-1 text-muted">
                            <span>Delivery</span>
                            <span>{delivery === 0 ? "Free" : `Rs ${delivery}`}</span>
                        </div>
                        {giftEarned && giftChoices.length > 0 && (
                            <div className="flex justify-between py-1 font-semibold text-green-600">
                                <span>🎁 Free gift</span>
                                <span>{gift ? gift.name : "Choose above"}</span>
                            </div>
                        )}
                        <div className="mt-2 flex justify-between border-t border-line pt-3 text-xl font-black">
                            <span>Total</span>
                            <span>Rs {grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    {error && <p className="mt-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 w-full rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Placing order..." : "Place order"}
                    </button>
                    <p className="mt-3 text-center text-xs text-muted">You pay in cash when the order arrives.</p>
                </aside>
            </form>
        );
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-295 px-5 py-10">
                <h1 className="mb-6 text-[clamp(28px,4vw,40px)] font-black tracking-tight">Checkout</h1>
                {content}
            </main>
            <Footer />
        </>
    );
}