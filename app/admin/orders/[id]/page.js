"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const pill = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

// what the admin can do from each status
const actions = {
    pending: [
        { to: "confirmed", label: "Confirm order", style: "bg-brand text-white hover:-translate-y-0.5" },
        { to: "cancelled", label: "Cancel order", style: "border border-red-300 text-red-600 hover:bg-red-600 hover:text-white" },
    ],
    confirmed: [
        { to: "shipped", label: "Mark as shipped", style: "bg-brand text-white hover:-translate-y-0.5" },
        { to: "cancelled", label: "Cancel order", style: "border border-red-300 text-red-600 hover:bg-red-600 hover:text-white" },
    ],
    shipped: [{ to: "delivered", label: "Mark as delivered", style: "bg-green-600 text-white hover:-translate-y-0.5" }],
    delivered: [],
    cancelled: [],
};

function OrderDetail() {
    const { id } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load order");
                setOrder(data);
            })
            .catch((err) => setError(err.message));
    }, [id, token]);

    async function changeStatus(to) {
        if (to === "cancelled" && !window.confirm("Cancel this order? The items go back into stock.")) return;
        setBusy(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: to }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Could not update");
            setOrder((o) => ({ ...o, status: data.status }));
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    if (!order) return <p className="text-muted">{error || "Loading..."}</p>;

    return (
        <div className="max-w-4xl">
            <Link href="/admin/orders" className="text-sm font-bold text-brand hover:underline">← Back to orders</Link>

            <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h1>
                <span className={`rounded-full px-3 py-1 text-sm font-extrabold capitalize ${pill[order.status]}`}>{order.status}</span>
            </div>
            <p className="mt-1 text-muted">
                Placed {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""} by {order.user?.name || "Deleted user"}
                {order.user?.email ? ` (${order.user.email})` : ""}
            </p>

            {error && <p className="mt-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

            {/* status buttons */}
            {actions[order.status].length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                    {actions[order.status].map((a) => (
                        <button
                            key={a.to}
                            disabled={busy}
                            onClick={() => changeStatus(a.to)}
                            className={`cursor-pointer rounded-xl px-6 py-3 font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${a.style}`}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* items */}
                <section className="rounded-[20px] border border-line bg-card p-7 lg:col-span-2">
                    <h2 className="mb-4 text-xl font-extrabold">Items</h2>
                    {order.items.map((i, index) => (
                        <div key={index} className="flex items-center gap-4 border-t border-line py-4 first:border-0">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                                {i.image && <Image src={i.image} alt={i.name} fill sizes="56px" className="object-contain" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <b className="block truncate">{i.name}</b>
                                <span className="text-sm text-muted">
                                    Rs {i.price.toLocaleString()} × {i.qty}
                                </span>
                            </div>
                            <b>Rs {(i.price * i.qty).toLocaleString()}</b>
                        </div>
                    ))}

                    <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                        <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>Rs {order.subtotal.toLocaleString()}</span></div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-700">
                                <span>Total discount ({Math.round((order.discountRate || 0) * 100)}%)</span>
                                <span>- Rs {order.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{order.delivery === 0 ? "Free" : `Rs ${order.delivery.toLocaleString()}`}</span></div>

                        {order.giftItem?.name && (
                            <div className="flex justify-between font-bold text-green-700">
                                <span>🎁 Free gift (pack it!)</span>
                                <span>{order.giftItem.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-black"><span>Final amount</span><span>Rs {order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* shipping */}
                <section className="h-fit rounded-[20px] border border-line bg-card p-7">
                    <h2 className="mb-4 text-xl font-extrabold">Ship to</h2>
                    <b className="block">{order.shipping?.fullName}</b>
                    <p className="mt-1 text-muted">{order.shipping?.address}</p>
                    <p className="text-muted">{order.shipping?.city}</p>
                    <p className="mt-2 font-semibold">📞 {order.shipping?.phone}</p>
                    <p className="mt-4 rounded-xl bg-brand/10 px-3 py-2 text-sm font-bold uppercase text-brand">
                        {order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod}
                    </p>
                </section>
            </div>
        </div>
    );
}

// Suspense is required around useParams in this Next version
export default function AdminOrderPage() {
    return (
        <Suspense fallback={<p className="text-muted">Loading...</p>}>
            <OrderDetail />
        </Suspense>
    );
}