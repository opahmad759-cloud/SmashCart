"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            setMessage(data.message);
        } catch (err) {
            setError(err.message === "Failed to fetch" ? "Cannot reach the server. Is the API running?" : err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-md px-5 py-14">
                <div className="rounded-3xl border border-line bg-card p-8">
                    <h1 className="text-3xl font-black tracking-tight">Forgot password?</h1>
                    <p className="mt-1 text-muted">Enter your email and we will send you a reset link.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                        </div>

                        {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}
                        {message && <p className="rounded-xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-muted">
                        <Link href="/login" className="font-bold text-brand hover:underline">← Back to login</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}