"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand disabled:bg-bg2 disabled:text-muted";

const errorText = (err) =>
    err.message === "Failed to fetch" ? "Cannot reach the server. Is the API running?" : err.message;

function Message({ msg }) {
    if (!msg.text) return null;
    return (
        <p
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${msg.type === "ok" ? "bg-green-100 text-green-700" : "bg-brand/10 text-brand"
                }`}
        >
            {msg.text}
        </p>
    );
}

export default function ProfilePage() {
    const { user, token, loaded, updateUser, logout } = useAuth();

    const [name, setName] = useState("");
    const [nameMsg, setNameMsg] = useState({ type: "", text: "" });
    const [savingName, setSavingName] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
    const [savingPw, setSavingPw] = useState(false);

    // put the saved name into the box
    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    // one helper for both requests
    async function patch(path, body) {
        const res = await fetch(`${API}${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.status === 401) {
            logout();
            throw new Error("Your session has expired. Please log in again.");
        }
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        return data;
    }

    async function handleName(e) {
        e.preventDefault();
        setNameMsg({ type: "", text: "" });
        setSavingName(true);
        try {
            const data = await patch("/api/users/me", { name });
            updateUser(data.user);
            setNameMsg({ type: "ok", text: "Your name has been updated" });
        } catch (err) {
            setNameMsg({ type: "error", text: errorText(err) });
        } finally {
            setSavingName(false);
        }
    }

    async function handlePassword(e) {
        e.preventDefault();
        setPwMsg({ type: "", text: "" });

        if (newPassword !== confirm) {
            setPwMsg({ type: "error", text: "The new passwords do not match" });
            return;
        }

        setSavingPw(true);
        try {
            await patch("/api/users/me/password", { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirm("");
            setPwMsg({ type: "ok", text: "Your password has been changed" });
        } catch (err) {
            setPwMsg({ type: "error", text: errorText(err) });
        } finally {
            setSavingPw(false);
        }
    }

    let content;

    if (!loaded) {
        content = <p className="text-muted">Loading...</p>;
    } else if (!user) {
        content = (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
                <p className="text-lg font-semibold">Please log in to see your profile</p>
                <Link href="/login" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 font-extrabold text-white">
                    Log in
                </Link>
            </div>
        );
    } else {
        content = (
            <div className="space-y-6">
                {/* header */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-black text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-lg font-black">{user.name}</p>
                            <p className="text-sm text-muted">{user.email}</p>
                        </div>
                    </div>
                    <Link href="/orders" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand">
                        My orders →
                    </Link>
                </div>

                {/* account details */}
                <form onSubmit={handleName} className="rounded-2xl border border-line bg-card p-6">
                    <h2 className="mb-4 text-xl font-black">Account details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Full name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Email</label>
                            <input type="email" value={user.email} disabled className={inputClass} />
                            <p className="mt-1 text-xs text-muted">Your email cannot be changed.</p>
                        </div>
                        <Message msg={nameMsg} />
                        <button
                            type="submit"
                            disabled={savingName}
                            className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {savingName ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>

                {/* change password */}
                <form onSubmit={handlePassword} className="rounded-2xl border border-line bg-card p-6">
                    <h2 className="mb-4 text-xl font-black">Change password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Current password</label>
                            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">New password</label>
                            <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-bold">Confirm new password</label>
                            <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
                        </div>
                        <Message msg={pwMsg} />
                        <button
                            type="submit"
                            disabled={savingPw}
                            className="rounded-xl bg-brand px-6 py-3 font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {savingPw ? "Changing..." : "Change password"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-2xl px-5 py-10">
                <h1 className="mb-6 text-[clamp(28px,4vw,40px)] font-black tracking-tight">My profile</h1>
                {content}
            </main>
            <Footer />
        </>
    );
}