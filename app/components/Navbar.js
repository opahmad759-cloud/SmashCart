"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const links = [
    { label: "Rackets", href: "/products?category=racket" },
    { label: "Shuttlecocks", href: "/products?category=shuttle" },
    { label: "Shoes", href: "/products?category=shoes" },
    { label: "Bags", href: "/products?category=bag" },
    { label: "About", href: "/about" },

];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(0);
    const { count } = useCart();
    const { user, token, logout, loaded } = useAuth();

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

    return (
        <>
            <div className="bg-brand px-3 py-2 text-center text-sm font-bold text-white">
                Free delivery on orders over Rs 10,000 · Pay on delivery
            </div>

            <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
                <div className="mx-auto flex h-17 max-w-295 items-center justify-between gap-4 px-5">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
                        <svg viewBox="0 0 32 32" className="h-7.5 w-7.5">
                            <circle cx="16" cy="16" r="15" className="fill-brand" />
                            <path d="M9 22 L16 8 L23 22 Z" fill="#fff" />
                            <circle cx="16" cy="23" r="3" fill="#fff" />
                        </svg>
                        <span>Smash<span className="text-brand">Cart</span></span>
                    </Link>

                    {/* desktop menu */}
                    <nav className="hidden gap-6 text-[15px] font-semibold text-muted lg:flex">
                        {links.map((l) => (
                            <Link key={l.label} href={l.href} className="hover:text-ink">{l.label}</Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2.5">
                        {/* wait until we know if someone is logged in, so it does not flicker */}
                        {loaded && (user ? (
                            <>
                                {user.role === "admin" && (
                                    <Link href="/admin" className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
                                        Admin
                                    </Link>
                                )}

                                <Link href="/orders" className="hidden text-sm font-semibold hover:text-brand sm:block">
                                    My orders
                                </Link>

                                <Link href="/profile" title="My profile" className="hidden text-sm font-semibold hover:text-brand sm:block">
                                    Hi, {user.name.split(" ")[0]}
                                </Link>
                                <button onClick={logout} className="hidden rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold hover:border-brand sm:block">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="hidden rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold sm:block">
                                Login
                            </Link>
                        ))}

                        <Link href="/cart" className="relative rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold">
                            Cart
                            <span className="absolute -right-2 -top-2 rounded-full bg-brand px-1.75 text-[11px] font-bold text-white">{count}</span>
                        </Link>

                        {/* shown only when the user has pending orders */}
                        {pending > 0 && (
                            <Link
                                href="/orders"
                                className="relative rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-700 hover:border-amber-500"
                            >
                                ⏳<span className="hidden sm:inline"> Pending</span>
                                <span className="absolute -right-2 -top-2 rounded-full bg-amber-500 px-1.75 text-[11px] font-bold text-white">{pending}</span>
                            </Link>
                        )}

                        {/* hamburger (phones and tablets) */}
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label="Menu"
                            className="rounded-xl border border-line bg-card px-3 py-2 text-lg leading-none lg:hidden"
                        >
                            {open ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* mobile menu (only opens when you press the hamburger) */}
                {open && (
                    <nav className="border-t border-line bg-bg px-5 py-3 lg:hidden">
                        {links.map((l) => (
                            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-2.5 font-semibold text-muted hover:text-ink">
                                {l.label}
                            </Link>
                        ))}
                        {loaded && (user ? (
                            <>
                                <Link href="/profile" onClick={() => setOpen(false)} className="block py-2.5 font-semibold text-muted hover:text-ink">
                                    My profile
                                </Link>
                                <Link href="/orders" onClick={() => setOpen(false)} className="block py-2.5 font-semibold text-muted hover:text-ink">
                                    My orders
                                </Link>
                                <button
                                    onClick={() => { logout(); setOpen(false); }}
                                    className="block py-2.5 font-semibold text-brand"
                                >
                                    Logout ({user.name.split(" ")[0]})
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setOpen(false)} className="block py-2.5 font-semibold text-brand">Login</Link>
                        ))}
                    </nav>
                )}
            </header>
        </>
    );
}