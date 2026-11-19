"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

export default function NewProduct() {
    const { token } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "", brand: "", category: "racket", level: "",
        price: "", oldPrice: "", tag: "", image: "", description: "", stock: 20,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/admin/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            router.push("/admin/products");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <Link href="/admin/products" className="text-sm font-bold text-brand hover:underline">← Back to products</Link>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Add product</h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-[20px] border border-line bg-card p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Name</label>
                        <input required value={form.name} onChange={set("name")} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Brand</label>
                        <input required value={form.brand} onChange={set("brand")} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Category</label>
                        <select value={form.category} onChange={set("category")} className={inputClass}>
                            <option value="racket">Racket</option>
                            <option value="shuttle">Shuttlecock</option>
                            <option value="shoes">Shoes</option>
                            <option value="bag">Bag</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Level (optional)</label>
                        <input value={form.level} onChange={set("level")} placeholder="same words as your other products" className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Price (Rs)</label>
                        <input required type="number" min="1" value={form.price} onChange={set("price")} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Old price (optional)</label>
                        <input type="number" min="1" value={form.oldPrice} onChange={set("oldPrice")} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Stock</label>
                        <input required type="number" min="0" step="1" value={form.stock} onChange={set("stock")} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-bold">Tag (optional)</label>
                        <input value={form.tag} onChange={set("tag")} placeholder="e.g. New, Sale" className={inputClass} />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-bold">Image path</label>
                    <input required value={form.image} onChange={set("image")} placeholder="/images/products/racket-4.jpg" className={inputClass} />
                    <p className="mt-1 text-xs text-muted">The photo must already be inside public/images/products.</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-bold">Description</label>
                    <textarea rows={4} value={form.description} onChange={set("description")} className={inputClass} />
                </div>

                {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Adding..." : "Add product"}
                </button>
            </form>
        </div>
    );
}