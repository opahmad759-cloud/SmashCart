"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

function OrderContent() {
    const { id } = useParams();
    const { token, loaded } = useAuth();

    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loaded) return;
        if (!token) {
            setError("Please log in to see your order.");
            return;
        }

        fetch(`${API}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load the order");
                return data;
            })
            .then((data) => setOrder(data))
            .catch((err) => setError(err.message));
    }, [id, token, loaded]);

    if (error) {
        return (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="font-semibold text-brand">{error}</p>
                <Link href="/login" className="mt-4 inline-block font-bold text-brand hover:underline">Go to login</Link>
            </div>
        );
    }

    if (!order) return <p className="text-muted">Loading...</p>;

    return (
        <div className="mx-auto max-w-2xl">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
                <h1 className="mt-4 text-[clamp(28px,4vw,38px)] font-black tracking-tight">Thank you, {order.shipping.fullName}!</h1>
                <p className="mt-1 text-muted">
                    Your order <b className="text-ink">#{order._id.slice(-6).toUpperCase()}</b> has been placed. We will call{" "}
                    <b className="text-ink">{order.shipping.phone}</b> to confirm it.
                </p>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-card p-6">
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.product} className="flex justify-between gap-4">
                            <span>
                                {item.name} <span className="text-muted">× {item.qty}</span>
                            </span>
                            <span className="font-semibold">Rs {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t border-line pt-3">
                    <div className="flex justify-between py-1 text-muted">
                        <span>Subtotal</span>
                        <span>Rs {order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between py-1 font-semibold text-green-600">
                            <span>Total discount{order.discountRate ? ` (${Math.round(order.discountRate * 100)}%)` : ""}</span>
                            <span>− Rs {order.discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-1 text-muted">
                        <span>Delivery</span>
                        <span>{order.delivery === 0 ? "Free" : `Rs ${order.delivery}`}</span>
                    </div>
                    {order.giftItem?.name && (
                        <div className="flex justify-between py-1 font-semibold text-green-600">
                            <span>🎁 Free gift</span>
                            <span>{order.giftItem.name}</span>
                        </div>
                    )}
                    <div className="mt-2 flex justify-between border-t border-line pt-3 text-xl font-black">
                        <span>Final amount</span>
                        <span>Rs {order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-card p-5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Delivery address</p>
                    <p className="mt-2 font-semibold">{order.shipping.fullName}</p>
                    <p className="text-muted">{order.shipping.address}</p>
                    <p className="text-muted">{order.shipping.city}</p>
                </div>
                <div className="rounded-2xl border border-line bg-card p-5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Payment</p>
                    <p className="mt-2 font-semibold">Cash on delivery</p>
                    <p className="text-muted">Status: <span className="font-semibold capitalize text-ink">{order.status}</span></p>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/products" className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white">Continue shopping</Link>
                <Link href="/orders" className="rounded-xl border border-line bg-card px-6 py-3 font-extrabold">View my orders</Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <>
            <Navbar />
            <main className="px-5 py-12">
                <Suspense fallback={<p className="text-center text-muted">Loading...</p>}>
                    <OrderContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}