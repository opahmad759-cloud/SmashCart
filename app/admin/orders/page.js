"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const tabs = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const pill = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        setError("");
        const query = status === "all" ? "" : `?status=${status}`;
        fetch(`${API}/api/admin/orders${query}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load orders");
                setOrders(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token, status]);

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Sales</p>
            <h1 className="text-4xl font-black tracking-tight">
                Orders <span className="ml-1 rounded-full bg-brand/15 px-3 py-1 align-middle text-base text-brand">{orders.length}</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setStatus(t)}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold capitalize transition ${status === t ? "border-brand bg-brand text-white" : "border-line bg-card text-muted hover:border-brand hover:text-brand"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {error && <p className="mt-4 text-brand">{error}</p>}
            {loading && <p className="mt-4 text-muted">Loading...</p>}

            <div className="mt-6 overflow-x-auto rounded-[20px] border border-line bg-card">
                <table className="w-full min-w-175 text-left">
                    <thead>
                        <tr className="border-b border-line text-xs font-extrabold uppercase tracking-wider text-muted">
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id} className="border-b border-line transition last:border-0 hover:bg-brand/5">
                                <td className="px-6 py-4">
                                    <b className="block">#{o._id.slice(-6).toUpperCase()}</b>
                                    <span className="text-sm text-muted">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <b className="block">{o.user?.name || "Deleted user"}</b>
                                    <span className="text-sm text-muted">{o.shipping?.city}</span>
                                </td>
                                <td className="px-6 py-4">{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                                <td className="px-6 py-4 font-bold">Rs {o.total.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${pill[o.status] || "bg-gray-100"}`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/orders/${o._id}`}
                                        className="cursor-pointer rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && orders.length === 0 && <p className="p-8 text-center text-muted">No orders found.</p>}
            </div>
        </div>
    );
}