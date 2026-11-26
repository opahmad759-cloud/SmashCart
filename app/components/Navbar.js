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
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [pending, setPending] = useState(0);
    const { count, settings, settingsLoaded } = useCart();
    const { user, token, logout, loaded } = useAuth();

    const close = () => {
        setOpen(false);
        setUserMenuOpen(false);
    };

    // Close user dropdown when clicking outside
    useEffect(() => {
        if (!userMenuOpen) return;
        const onClickOutside = (e) => {
            if (!e.target.closest("#user-account-menu")) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("click", onClickOutside);
        return () => document.removeEventListener("click", onClickOutside);
    }, [userMenuOpen]);

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
                <div className="bg-brand px-3 py-2 text-center text-xs font-black uppercase tracking-wider text-white shadow-xs">
                    <span className="inline-block animate-pulse-subtle mr-2">⚡</span>
                    {offerText}
                </div>
            )}
            <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur-md shadow-xs transition-colors">
                <div className="mx-auto flex h-18 max-w-295 items-center justify-between gap-6 px-5">
                    {/* Brand & Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        {/* mobile menu toggle */}
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            className="flex h-10.5 w-10.5 items-center justify-center rounded-xl border border-line bg-bg transition-colors hover:border-brand lg:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <Link href="/" className="group flex items-center gap-2.5 text-2xl font-black tracking-tight">
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/20 transition-transform duration-300 group-hover:scale-105">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                                    <circle cx="12" cy="8" r="5" />
                                    <path d="M12 13v8" />
                                    <path d="M9 17h6" />
                                    <path d="M9 21h6" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-[-0.03em] uppercase">
                                Smash<span className="text-brand">Cart</span>
                            </span>
                            <span className="hidden sm:inline-block rounded-sm bg-ink px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">PRO</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="group relative px-3.5 py-2 text-[13px] font-extrabold uppercase tracking-wider text-muted transition-colors hover:text-ink"
                            >
                                <span>{link.label}</span>
                                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions cluster */}
                    <div className="flex items-center gap-2.5">
                        {loaded && user && user.role === "admin" && (
                            <Link href="/admin" className="rounded-xl bg-ink px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand">
                                Admin
                            </Link>
                        )}

                        {loaded && !user && (
                            <Link href="/login" className="rounded-xl border border-line bg-card px-4 py-2 text-[13px] font-extrabold text-ink transition hover:border-brand hover:text-brand">
                                Sign In
                            </Link>
                        )}

                        {loaded && user && (
                            <div id="user-account-menu" className="relative">
                                <button
                                    onClick={() => setUserMenuOpen((prev) => !prev)}
                                    aria-expanded={userMenuOpen}
                                    aria-label="User account menu"
                                    className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-1.5 text-xs font-bold transition hover:border-brand active:scale-95"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-black text-white">
                                        {firstName.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="hidden sm:inline font-black text-ink">{firstName}</span>
                                    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 text-muted transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}>
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-2xl z-50 animate-pop-in">
                                        <div className="px-3 py-2 border-b border-line">
                                            <p className="text-xs font-black text-ink truncate">{user.name}</p>
                                            <p className="text-[11px] text-muted truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition hover:bg-bg2"
                                            >
                                                <span>👤</span>
                                                <span>Profile Settings</span>
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition hover:bg-bg2"
                                            >
                                                <span>📦</span>
                                                <span>My Orders</span>
                                            </Link>
                                        </div>
                                        <div className="pt-1 border-t border-line">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 text-left cursor-pointer"
                                            >
                                                <span>🚪</span>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Link href="/cart" className="relative flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2 text-[13px] font-extrabold transition-all duration-200 hover:border-brand hover:-translate-y-0.5 active:scale-95 shadow-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <span className="hidden sm:inline">Bag</span>
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-black text-white shadow-xs">
                                {count}
                            </span>
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