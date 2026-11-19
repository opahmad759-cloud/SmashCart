"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const pill = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function AdminHome() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load stats");
                setStats(data);
            })
            .catch((err) => setError(err.message));
    }, [token]);

    if (error) return <p className="text-brand">{error}</p>;
    if (!stats) return <p className="text-muted">Loading...</p>;

    const cards = [
        { label: "Total orders", value: stats.totalOrders, icon: "📦", tone: "bg-blue-100" },
        { label: "Pending orders", value: stats.pendingOrders, icon: "⏳", tone: "bg-amber-100" },
        { label: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: "💵", tone: "bg-green-100" },
        { label: "Customers", value: stats.customers, icon: "👥", tone: "bg-brand/15" },
    ];

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Overview</p>
            <h1 className="text-4xl font-black tracking-tight">Welcome back, {user.name.split(" ")[0]}</h1>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((c) => (
                    <div key={c.label} className="rounded-[20px] border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${c.tone}`}>{c.icon}</div>
                        <p className="text-sm font-semibold text-muted">{c.label}</p>
                        <p className="mt-1 text-3xl font-black tracking-tight">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <section className="rounded-[20px] border border-line bg-card p-7">
                    <h2 className="mb-4 text-xl font-extrabold">Recent orders</h2>
                    {stats.recentOrders.length === 0 && <p className="text-muted">No orders yet.</p>}
                    {stats.recentOrders.map((o) => (
                        <div key={o._id} className="flex items-center justify-between gap-3 border-t border-line py-3.5 first:border-0">
                            <div className="min-w-0">
                                <b className="block truncate">{o.user?.name || "Deleted user"}</b>
                                <span className="text-sm text-muted">
                                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${pill[o.status] || "bg-gray-100"}`}>
                                    {o.status}
                                </span>
                                <b>Rs {o.total.toLocaleString()}</b>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="rounded-[20px] border border-line bg-card p-7">
                    <h2 className="mb-4 text-xl font-extrabold">Low stock</h2>
                    {stats.lowStock.length === 0 && (
                        <p className="rounded-xl bg-green-100 px-4 py-3 font-semibold text-green-700">✓ All products are well stocked.</p>
                    )}
                    {stats.lowStock.map((p) => (
                        <div key={p._id} className="flex items-center justify-between border-t border-line py-3.5 first:border-0">
                            <span className="font-semibold">{p.name}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                            </span>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}