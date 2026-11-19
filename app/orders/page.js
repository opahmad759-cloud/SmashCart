"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersPage() {
    const { token, loaded } = useAuth();
    const [orders, setOrders] = useState(null); // null = not loaded yet
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loaded || !token) return;

        fetch(`${API}/api/orders/mine`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load your orders");
                return data;
            })
            .then((data) => setOrders(data))
            .catch((err) => setError(err.message));
    }, [token, loaded]);

    let content;

    if (!loaded) {
        content = <p className="text-muted">Loading...</p>;
    } else if (!token) {
        content = (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="text-lg font-semibold">Please log in to see your orders</p>
                <Link href="/login" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 font-extrabold text-white">
                    Log in
                </Link>
            </div>
        );
    } else if (error) {
        content = <p className="font-semibold text-brand">{error}</p>;
    } else if (orders === null) {
        content = <p className="text-muted">Loading...</p>;
    } else if (orders.length === 0) {
        content = (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="text-lg font-semibold">You have no orders yet</p>
                <p className="mt-1 text-muted">When you place an order, it will show up here.</p>
                <Link href="/products" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 font-extrabold text-white">
                    Shop products
                </Link>
            </div>
        );
    } else {
        content = (
            <div className="space-y-4">
                {orders.map((order) => {
                    const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
                    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });

                    return (
                        <div key={order._id} className="rounded-2xl border border-line bg-card p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="font-black">Order #{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-sm text-muted">Placed on {date}</p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                {order.items.slice(0, 4).map((item) => (
                                    <div key={item.product} className="relative h-14 w-14 overflow-hidden rounded-lg bg-bg2">
                                        {item.image && (
                                            <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />
                                        )}
                                    </div>
                                ))}
                                {order.items.length > 4 && (
                                    <span className="text-sm font-bold text-muted">+{order.items.length - 4} more</span>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                                <p className="text-muted">
                                    {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                                    <b className="text-ink">Rs {order.total.toLocaleString()}</b>
                                </p>
                                <Link
                                    href={`/orders/${order._id}`}
                                    className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand"
                                >
                                    View details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-3xl px-5 py-10">
                <h1 className="mb-6 text-[clamp(28px,4vw,40px)] font-black tracking-tight">My orders</h1>
                {content}
            </main>
            <Footer />
        </>
    );
}