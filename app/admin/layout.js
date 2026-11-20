"use client";
import { Suspense, useEffect } from "react";
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
];

function AdminShell({ children }) {
    const { user, loaded, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isAdmin = user?.role === "admin";


    useEffect(() => {
        if (loaded && !isAdmin) router.replace("/login");
    }, [loaded, isAdmin, router]);

    if (!loaded || !isAdmin) {
        return <p className="p-10 text-center text-muted">Checking access...</p>;
    }

    const active = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

    return (
        <div className="min-h-screen bg-bg lg:flex">
            {/* sidebar */}
            <aside className="border-b border-line bg-card lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-6">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">▲</span>
                        <span className="text-xl font-black tracking-tight">
                            Smash<span className="text-brand">Cart</span>
                        </span>
                    </Link>
                    <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand lg:mt-3 lg:inline-block">
                        Admin
                    </span>
                </div>

                <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:flex-col lg:gap-1 lg:px-4 lg:pb-0">
                    {nav.map((n) => (
                        <Link
                            key={n.href}
                            href={n.href}
                            className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] font-bold transition ${active(n.href) ? "bg-brand text-white shadow-sm" : "text-muted hover:bg-brand/10 hover:text-brand"
                                }`}
                        >
                            <span>{n.icon}</span>
                            {n.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden px-4 lg:absolute lg:bottom-0 lg:block lg:w-64 lg:border-t lg:border-line lg:py-4">
                    <p className="px-2 text-sm font-bold">{user.name}</p>
                    <p className="mb-3 truncate px-2 text-xs text-muted">{user.email}</p>
                    <div className="flex gap-2">
                        <Link href="/" className="flex-1 rounded-xl border border-line px-3 py-2 text-center text-sm font-semibold hover:border-brand">
                            View shop
                        </Link>
                        <button onClick={logout} className="flex-1 rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:border-brand">
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
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