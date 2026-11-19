"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { token } = useAuth();

    async function handleDelete(p) {
        if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        setError("");
        try {
            const res = await fetch(`${API}/api/admin/products/${p._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Could not delete");
            // remove it from the list right away
            setProducts((list) => list.filter((x) => x._id !== p._id));
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        fetch(`${API}/api/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch(() => setError("Could not load products"))
            .finally(() => setLoading(false));
    }, []);

    const shown = products.filter((p) =>
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Catalog</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl font-black tracking-tight">
                    Products <span className="ml-1 rounded-full bg-brand/15 px-3 py-1 align-middle text-base text-brand">{products.length}</span>
                </h1>

                <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍 Search name, brand, category..."
                        className="w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand sm:w-80"
                    />
                    <Link href="/admin/products/new" className="rounded-xl bg-brand px-5 py-3 font-extrabold text-white transition hover:-translate-y-0.5">
                        + Add product
                    </Link>
                </div>
            </div>

            {error && <p className="mt-4 text-brand">{error}</p>}
            {loading && <p className="mt-4 text-muted">Loading...</p>}

            <div className="mt-6 overflow-x-auto rounded-[20px] border border-line bg-card">
                <table className="w-full min-w-175 text-left">
                    <thead>
                        <tr className="border-b border-line text-xs font-extrabold uppercase tracking-wider text-muted">
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((p) => (
                            <tr key={p._id} className="border-b border-line transition last:border-0 hover:bg-brand/5">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                                            {p.image && <Image src={p.image} alt={p.name} fill sizes="56px" className="object-contain" />}
                                        </div>
                                        <div>
                                            <b className="block">{p.name}</b>
                                            <span className="text-sm text-muted">{p.brand}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold capitalize text-brand">{p.category}</span>
                                </td>
                                <td className="px-6 py-4 font-bold">Rs {p.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${p.stock === 0
                                            ? "bg-red-100 text-red-700"
                                            : p.stock <= 5
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/products/${p._id}/edit`}
                                            className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p)}
                                            className="cursor-pointer rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && shown.length === 0 && <p className="p-8 text-center text-muted">No products found.</p>}
            </div>
        </div>
    );
}