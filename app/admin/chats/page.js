"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminChats() {
    const { token } = useAuth();
    const [data, setData] = useState({ total: 0, top: [], chats: [] });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/admin/chats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (res) => {
                const d = await res.json();
                if (!res.ok) throw new Error(d.message || "Could not load chats");
                setData(d);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    async function remove(id) {
        if (!confirm("Delete this chat?")) return;
        try {
            const res = await fetch(`${API}/api/admin/chats/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.message || "Could not delete");
            setData((prev) => ({ ...prev, total: prev.total - 1, chats: prev.chats.filter((c) => c._id !== id) }));
        } catch (err) {
            setError(err.message);
        }
    }

    const shown = data.chats.filter((c) => `${c.question} ${c.reply}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Assistant</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl font-black tracking-tight">
                    Chats <span className="ml-1 rounded-full bg-brand/15 px-3 py-1 align-middle text-base text-brand">{data.total}</span>
                </h1>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search questions..."
                    className="w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand sm:w-80"
                />
            </div>
            <p className="mt-2 text-sm text-muted">What customers ask the chatbot. Chats are deleted automatically after 90 days.</p>

            {error && <p className="mt-4 text-brand">{error}</p>}
            {loading && <p className="mt-4 text-muted">Loading...</p>}

            {data.top.length > 0 && (
                <div className="mt-6 rounded-[20px] border border-line bg-card p-5">
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted">Asked most often</p>
                    <div className="flex flex-wrap gap-2">
                        {data.top.map((t) => (
                            <span key={t.question} className="rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-semibold text-brand">
                                {t.question} <b>×{t.count}</b>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-3">
                {shown.map((c) => (
                    <div key={c._id} className="rounded-[20px] border border-line bg-card p-5">
                        <div className="flex items-start justify-between gap-4">
                            <p className="font-bold">{c.question}</p>
                            <button onClick={() => remove(c._id)} className="shrink-0 cursor-pointer rounded-lg border border-line px-3 py-1 text-xs font-bold text-muted hover:border-brand hover:text-brand">
                                Delete
                            </button>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{c.reply}</p>
                        <p className="mt-3 text-xs text-muted">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                ))}
                {!loading && shown.length === 0 && (
                    <p className="rounded-[20px] border border-line bg-card p-8 text-center text-muted">No chats yet.</p>
                )}
            </div>
        </div>
    );
}