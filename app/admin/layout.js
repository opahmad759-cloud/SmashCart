"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const nav = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "🏸" },
    { href: "/admin/orders", label: "Orders", icon: "📦" },
    { href: "/admin/customers", label: "Customers", icon: "👥" },
    { href: "/admin/stock", label: "Stock", icon: "📋" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
    { href: "/admin/chats", label: "Chats", icon: "💬" },
];

function AdminShell({ children }) {
    const { user, loaded, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isAdmin = user?.role === "admin";
    const [open, setOpen] = useState(false);

    const close = () => setOpen(false);

    useEffect(() => {
        if (loaded && !isAdmin) router.replace("/login");
    }, [loaded, isAdmin, router]);

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

    if (!loaded || !isAdmin) {
        return <p className="p-10 text-center text-muted">Checking access...</p>;
    }

    const active = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
    const current = nav.find((n) => active(n.href));

    return (
        <div className="min-h-screen bg-bg">
            {/* top bar */}
            <header className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between gap-3 px-5 lg:px-8">
                    <div className="flex items-center gap-3">
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

                        <Link href="/admin" className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">▲</span>
                            <span className="text-xl font-black tracking-tight">
                                Smash<span className="text-brand">Cart</span>
                            </span>
                        </Link>
                        <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand">
                            Admin
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {current && (
                            <span className="hidden text-sm font-bold text-muted sm:block">
                                {current.icon} {current.label}
                            </span>
                        )}
                        <Link href="/" className="rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold hover:border-brand">
                            View shop
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
                className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85%] flex-col bg-card shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <div>
                        <p className="text-xl font-black tracking-tight">
                            Smash<span className="text-brand">Cart</span>
                        </p>
                        <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand">
                            Admin
                        </span>
                    </div>
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-bg2"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                    {nav.map((n) => (
                        <Link
                            key={n.href}
                            href={n.href}
                            onClick={close}
                            className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] font-bold transition ${active(n.href) ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-brand/10 hover:text-brand"
                                }`}
                        >
                            <span>{n.icon}</span>
                            {n.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-line p-4">
                    <p className="px-2 text-sm font-bold">{user.name}</p>
                    <p className="mb-3 truncate px-2 text-xs text-muted">{user.email}</p>
                    <div className="flex gap-2">
                        <Link href="/" onClick={close} className="flex-1 rounded-xl border border-line px-3 py-2 text-center text-sm font-semibold hover:border-brand">
                            View shop
                        </Link>
                        <button onClick={logout} className="flex-1 rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:border-brand">
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <Suspense fallback={<p className="p-10 text-center text-muted">Loading...</p>}>
            <AdminShell>{children}</AdminShell>
        </Suspense>
    );
}