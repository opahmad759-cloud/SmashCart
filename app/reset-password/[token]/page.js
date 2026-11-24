"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

function ResetForm() {
    const { token } = useParams(); // the long text from the link

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            setDone(true);
        } catch (err) {
            setError(err.message === "Failed to fetch" ? "Cannot reach the server. Is the API running?" : err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-md px-5 py-14">
            <div className="rounded-3xl border border-line bg-card p-8">
                <h1 className="text-3xl font-black tracking-tight">Set a new password</h1>

                {done ? (
                    <div className="mt-6">
                        <p className="rounded-xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-700">
                            Password changed. You can log in now.
                        </p>
                        <Link
                            href="/login"
                            className="mt-5 block rounded-xl bg-brand px-6 py-3.5 text-center text-lg font-extrabold text-white"
                        >
                            Go to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">New password</label>
                            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Confirm password</label>
                            <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again" className={inputClass} />
                        </div>

                        {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Change password"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<p className="mx-auto max-w-md px-5 py-14 text-muted">Loading...</p>}>
                <ResetForm />
            </Suspense>
            <Footer />
        </>
    );
}