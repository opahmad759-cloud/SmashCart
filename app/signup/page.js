"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); // stop the browser from reloading the page
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");

            login(data.token, data.user); // remember the user
            router.push("/");
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
                    <h1 className="text-3xl font-black tracking-tight">Create account</h1>
                    <p className="mt-1 text-muted">Join SmashCart to track your orders.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Full name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmad Mehboob" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Password</label>
                            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
                        </div>

                        {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-muted">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-brand hover:underline">Log in</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}