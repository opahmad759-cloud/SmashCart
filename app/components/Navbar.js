"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const links = [
    { label: "Rackets", href: "/products?category=racket", icon: "🏸" },
    { label: "Shuttlecocks", href: "/products?category=shuttle", icon: "🪶" },
    { label: "Shoes", href: "/products?category=shoes", icon: "👟" },
    { label: "Bags", href: "/products?category=bag", icon: "🎒" },
    { label: "About", href: "/about", icon: "ℹ️" },
];

const sideLink = "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-muted transition hover:bg-bg2 hover:text-ink";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(0);
    const { count, settings, settingsLoaded } = useCart();
    const { user, token, logout, loaded } = useAuth();

    const close = () => setOpen(false);

    // how many orders are still pending (only for logged-in users)
    useEffect(() => {
        if (!loaded || !token) {
            setPending(0);
            return;
        }

        let cancelled = false;
        fetch(`${API}/api/orders/pending-count`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => (res.ok ? res.json() : { count: 0 }))
            .then((data) => {
                if (!cancelled) setPending(data.count || 0);
            })
            .catch(() => {
                if (!cancelled) setPending(0);
            });

        return () => {
            cancelled = true;
        };
    }, [token, loaded]);

    // while the sidebar is open: Escape closes it, and the page behind it does not scroll
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const before = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = before;
        };
    }, [open]);

    const firstName = user ? user.name.split(" ")[0] : "";
    // top bar text, built from the shop settings (it changes when the admin changes them)
    const offers = [];
    if (settings.freeDeliveryFrom > 0) offers.push(`Free delivery on orders over Rs ${Number(settings.freeDeliveryFrom).toLocaleString()}`);
    if (settings.tier1Percent > 0) offers.push(`${settings.tier1Percent}% off on ${settings.tier1MinItems}+ items`);
    if (settings.tier2Percent > 0) offers.push(`${settings.tier2Percent}% off on ${settings.tier2MinItems}+ items`);
    offers.push("Pay on delivery");
    const offerText = offers.join(" · ");

    return (
        <>
            {settingsLoaded && (
                <div className="bg-brand px-3 py-2 text-center text-sm font-bold text-white">
                    {offerText}
                </div>
            )}
            <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
                <div className="mx-auto flex h-17 max-w-295 items-center justify-between gap-4 px-5">
                    <div className="flex items-center gap-3">
                        {/* sidebar button */}
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            className="flex h-10.5 w-10.5 items-center justify-center rounded-xl border border-line bg-card hover:border-brand"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
                            <svg viewBox="0 0 32 32" className="h-7.5 w-7.5">
                                <circle cx="16" cy="16" r="15" className="fill-brand" />
                                <path d="M9 22 L16 8 L23 22 Z" fill="#fff" />
                                <circle cx="16" cy="23" r="3" fill="#fff" />
                            </svg>
                            <span>Smash<span className="text-brand">Cart</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* wait until we know if someone is logged in, so it does not flicker */}
                        {loaded && user && user.role === "admin" && (
                            <Link href="/admin" className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
                                Admin
                            </Link>
                        )}

                        {loaded && !user && (
                            <Link href="/login" className="rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold hover:border-brand">
                                Login
                            </Link>
                        )}

                        <Link href="/cart" className="relative rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold hover:border-brand">
                            Cart
                            <span className="absolute -right-2 -top-2 rounded-full bg-brand px-1.75 text-[11px] font-bold text-white">{count}</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* dark background behind the sidebar (click it to close) */}
            <div
                onClick={close}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />

            {/* the sidebar */}
            <aside
                aria-hidden={!open}
                className={`fixed left-0 top-0 z-50 flex h-full w-75 max-w-[85%] flex-col bg-bg shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* heading */}
                <div className="flex items-start justify-between gap-3 border-b border-line p-5">
                    {loaded && user ? (
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
                                {firstName.charAt(0).toUpperCase()}
                            </span>
                            <div>
                                <h2 className="text-xl font-black leading-tight">Hi, {firstName}</h2>
                                <Link href="/profile" onClick={close} className="text-sm font-semibold text-brand hover:underline">
                                    View profile
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-black leading-tight">Welcome 👋</h2>
                            <p className="text-sm text-muted">Log in to track your orders.</p>
                        </div>
                    )}
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg hover:bg-bg2"
                    >
                        ✕
                    </button>
                </div>

                {/* links */}
                <nav className="flex-1 overflow-y-auto p-3">
                    {links.map((l) => (
                        <Link key={l.label} href={l.href} onClick={close} className={sideLink}>
                            <span className="w-6 text-center text-lg">{l.icon}</span>
                            {l.label}
                        </Link>
                    ))}

                    {loaded && user && (
                        <Link href="/orders" onClick={close} className={`${sideLink} flex items-center justify-between`}>
                            <span className="flex items-center gap-3">
                                <span className="w-6 text-center text-lg">📦</span>
                                My orders
                            </span>
                            {pending > 0 && (
                                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">{pending} pending</span>
                            )}
                        </Link>
                    )}
                </nav>

                {/* bottom: logout or login */}
                <div className="border-t border-line p-4">
                    {loaded && user ? (
                        <button
                            onClick={() => { logout(); close(); }}
                            className="w-full rounded-xl border border-line bg-card px-4 py-3 font-bold hover:border-brand"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/login" onClick={close} className="flex-1 rounded-xl bg-brand px-4 py-3 text-center font-extrabold text-white">
                                Log in
                            </Link>
                            <Link href="/signup" onClick={close} className="flex-1 rounded-xl border border-line px-4 py-3 text-center font-extrabold">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}