"use client";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const steps = ["pending", "confirmed", "shipped", "delivered"];

function OrderDetail() {
    const { id } = useParams();
    const { token, loaded } = useAuth();

    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");

    useEffect(() => {
        if (!loaded) return;
        if (!token) {
            setError("Please log in to see this order.");
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

    async function handleCancel() {
        if (!window.confirm("Cancel this order? This cannot be undone.")) return;

        setCancelError("");
        setCancelling(true);
        try {
            const res = await fetch(`${API}/api/orders/${id}/cancel`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Could not cancel the order");
            setOrder(data); // the page now shows the cancelled order
        } catch (err) {
            setCancelError(err.message);
        } finally {
            setCancelling(false);
        }
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="font-semibold text-brand">{error}</p>
                <Link href="/orders" className="mt-4 inline-block font-bold text-brand hover:underline">Back to my orders</Link>
            </div>
        );
    }

    if (!order) return <p className="text-muted">Loading...</p>;

    const current = steps.indexOf(order.status);
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div>
            <Link href="/orders" className="text-sm font-bold text-muted hover:text-brand">← Back to my orders</Link>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-[clamp(26px,4vw,36px)] font-black tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h1>
                    <p className="text-muted">Placed on {date}</p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* progress */}
            <div className="mt-6 rounded-2xl border border-line bg-card p-6">
                {order.status === "cancelled" ? (
                    <p className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">This order was cancelled.</p>
                ) : (
                    <div className="flex items-center">
                        {steps.map((step, i) => (
                            <div key={step} className="flex flex-1 items-center last:flex-none">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= current ? "bg-brand text-white" : "bg-bg2 text-muted"
                                            }`}
                                    >
                                        {i < current ? "✓" : i + 1}
                                    </div>
                                    <span className={`mt-1 text-xs font-semibold capitalize ${i <= current ? "text-ink" : "text-muted"}`}>
                                        {step}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`mx-2 mb-5 h-0.5 flex-1 ${i < current ? "bg-brand" : "bg-line"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* items */}
            <div className="mt-5 rounded-2xl border border-line bg-card p-6">
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.product} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bg2">
                                {item.image && (
                                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <Link href={`/products/${item.product}`} className="font-semibold hover:text-brand">{item.name}</Link>
                                <p className="text-sm text-muted">
                                    Rs {item.price.toLocaleString()} × {item.qty}
                                </p>
                            </div>
                            <b>Rs {(item.price * item.qty).toLocaleString()}</b>
                        </div>
                    ))}
                </div>

                <div className="mt-5 border-t border-line pt-3">
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

            {/* address and payment */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-card p-5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Delivery address</p>
                    <p className="mt-2 font-semibold">{order.shipping.fullName}</p>
                    <p className="text-muted">{order.shipping.address}</p>
                    <p className="text-muted">{order.shipping.city}</p>
                    <p className="text-muted">{order.shipping.phone}</p>
                </div>
                <div className="rounded-2xl border border-line bg-card p-5">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Payment</p>
                    <p className="mt-2 font-semibold">Cash on delivery</p>
                    <p className="text-muted">Pay Rs {order.total.toLocaleString()} when it arrives.</p>
                </div>
            </div>
            {order.status === "pending" && (
                <div className="mt-5 rounded-2xl border border-line bg-card p-5">
                    <p className="font-semibold">Changed your mind?</p>
                    <p className="text-sm text-muted">
                        You can cancel this order while it is still pending. After we confirm it, it can no longer be cancelled here.
                    </p>
                    {cancelError && (
                        <p className="mt-3 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{cancelError}</p>
                    )}
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="mt-4 rounded-xl border-2 border-red-500 px-5 py-2.5 font-extrabold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelling ? "Cancelling..." : "Cancel order"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-3xl px-5 py-10">
                <Suspense fallback={<p className="text-muted">Loading...</p>}>
                    <OrderDetail />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}