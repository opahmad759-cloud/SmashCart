"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminCustomers() {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/admin/customers`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Could not load customers");
                setCustomers(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    const shown = customers.filter((c) =>
        `${c.name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">People</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl font-black tracking-tight">
                    Customers <span className="ml-1 rounded-full bg-brand/15 px-3 py-1 align-middle text-base text-brand">{customers.length}</span>
                </h1>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search name or email..."
                    className="w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand sm:w-80"
                />
            </div>

            {error && <p className="mt-4 text-brand">{error}</p>}
            {loading && <p className="mt-4 text-muted">Loading...</p>}

            <div className="mt-6 overflow-x-auto rounded-[20px] border border-line bg-card">
                <table className="w-full min-w-175 text-left">
                    <thead>
                        <tr className="border-b border-line text-xs font-extrabold uppercase tracking-wider text-muted">
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4">Total spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((c) => (
                            <tr key={c._id} className="border-b border-line transition last:border-0 hover:bg-brand/5">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 font-black uppercase text-brand">
                                            {c.name?.[0] || "?"}
                                        </span>
                                        <div className="min-w-0">
                                            <b className="block truncate">{c.name}</b>
                                            <span className="text-sm text-muted">{c.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted">{new Date(c.joined).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${c.orders > 0 ? "bg-brand/10 text-brand" : "bg-gray-100 text-muted"
                                            }`}
                                    >
                                        {c.orders} {c.orders === 1 ? "order" : "orders"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold">Rs {c.spent.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && shown.length === 0 && <p className="p-8 text-center text-muted">No customers found.</p>}
            </div>
        </div>
    );
}