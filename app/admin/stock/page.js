"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const filters = [
    { key: "all", label: "All" },
    { key: "low", label: "Low (5 or less)" },
    { key: "out", label: "Out of stock" },
];

export default function AdminStock() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [edits, setEdits] = useState({}); // id -> text in the input box
    const [saved, setSaved] = useState(""); // id of the row just saved
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API}/api/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch(() => setError("Could not load products"))
            .finally(() => setLoading(false));
    }, []);

    async function save(p) {
        setError("");
        try {
            const res = await fetch(`${API}/api/admin/products/${p._id}/stock`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ stock: edits[p._id] }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Could not save");

            setProducts((list) => list.map((x) => (x._id === p._id ? { ...x, stock: data.stock } : x)));
            setEdits((e) => {
                const copy = { ...e };
                delete copy[p._id];
                return copy;
            });
            setSaved(p._id);
            setTimeout(() => setSaved(""), 1500);
        } catch (err) {
            setError(err.message);
        }
    }

    const shown = products.filter((p) =>
        filter === "low" ? p.stock <= 5 && p.stock > 0 : filter === "out" ? p.stock === 0 : true
    );
    const lowCount = products.filter((p) => p.stock <= 5).length;

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Inventory</p>
            <h1 className="text-4xl font-black tracking-tight">Stock</h1>
            <p className="mt-1 text-muted">
                {lowCount === 0 ? "All products are well stocked." : `${lowCount} product${lowCount === 1 ? "" : "s"} need attention.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition ${filter === f.key ? "border-brand bg-brand text-white" : "border-line bg-card text-muted hover:border-brand hover:text-brand"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {error && <p className="mt-4 text-brand">{error}</p>}
            {loading && <p className="mt-4 text-muted">Loading...</p>}

            <div className="mt-6 overflow-x-auto rounded-[20px] border border-line bg-card">
                <table className="w-full min-w-150 text-left">
                    <thead>
                        <tr className="border-b border-line text-xs font-extrabold uppercase tracking-wider text-muted">
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((p) => {
                            const changed = edits[p._id] !== undefined && String(edits[p._id]) !== String(p.stock);
                            return (
                                <tr key={p._id} className="border-b border-line transition last:border-0 hover:bg-brand/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                                                {p.image && <Image src={p.image} alt={p.name} fill sizes="48px" className="object-contain" />}
                                            </div>
                                            <div>
                                                <b className="block">{p.name}</b>
                                                <span className="text-sm capitalize text-muted">{p.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-extrabold ${p.stock === 0
                                                    ? "bg-red-100 text-red-700"
                                                    : p.stock <= 5
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {p.stock === 0 ? "Out of stock" : p.stock <= 5 ? "Low" : "In stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={edits[p._id] ?? p.stock}
                                            onChange={(e) => setEdits({ ...edits, [p._id]: e.target.value })}
                                            className="w-24 rounded-xl border border-line bg-card px-3 py-2 outline-none focus:border-brand"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {saved === p._id ? (
                                            <span className="text-sm font-bold text-green-600">Saved ✓</span>
                                        ) : (
                                            <button
                                                disabled={!changed}
                                                onClick={() => save(p)}
                                                className="cursor-pointer rounded-xl bg-brand px-5 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!loading && shown.length === 0 && <p className="p-8 text-center text-muted">Nothing here.</p>}
            </div>
        </div>
    );
}