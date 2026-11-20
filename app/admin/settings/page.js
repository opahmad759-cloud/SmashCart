"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

function Field({ label, hint, value, onChange }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-bold">{label}</label>
            <input type="number" min="0" step="1" required value={value} onChange={onChange} className={inputClass} />
            {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
    );
}

export default function AdminSettings() {
    const { token } = useAuth();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/settings`)
            .then((res) => res.json())
            .then((s) => setForm(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, String(v)]))))
            .catch(() => setError("Could not load settings"));
    }, []);

    if (!form) return <p className="text-muted">{error || "Loading..."}</p>;

    const set = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value });
        setSaved(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/admin/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Could not save");
            setSaved(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Shop</p>
            <h1 className="text-4xl font-black tracking-tight">Settings</h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                <section className="rounded-[20px] border border-line bg-card p-7">
                    <h2 className="mb-4 text-xl font-extrabold">🚚 Delivery</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Delivery fee (Rs)" value={form.deliveryFee} onChange={set("deliveryFee")} />
                        <Field
                            label="Free delivery from (Rs)"
                            hint="Orders at or above this amount (after discount) ship free."
                            value={form.freeDeliveryFrom}
                            onChange={set("freeDeliveryFrom")}
                        />
                    </div>
                </section>

                <section className="rounded-[20px] border border-line bg-card p-7">
                    <h2 className="mb-4 text-xl font-extrabold">🏷️ Order discount</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Small discount starts at (items)" value={form.tier1MinItems} onChange={set("tier1MinItems")} />
                        <Field label="Small discount (%)" value={form.tier1Percent} onChange={set("tier1Percent")} />
                        <Field label="Big discount starts at (items)" value={form.tier2MinItems} onChange={set("tier2MinItems")} />
                        <Field label="Big discount (%)" value={form.tier2Percent} onChange={set("tier2Percent")} />
                    </div>
                    <p className="mt-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
                        Preview: {form.tier1MinItems}–{Number(form.tier2MinItems) - 1} items get {form.tier1Percent}% off,{" "}
                        {form.tier2MinItems}+ items get {form.tier2Percent}% off.
                    </p>
                </section>

                {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}
                {saved && <p className="rounded-xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-700">Settings saved ✓</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Save settings"}
                </button>
            </form>
        </div>
    );
}