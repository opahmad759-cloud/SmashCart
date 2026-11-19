"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const FREE_DELIVERY_OVER = 10000;

export default function CartPage() {
    const { items, count, total, discountRate, discount, delivery, grandTotal, loaded, changeQty, removeFromCart, clearCart } = useCart();

    const percent = Math.round(discountRate * 100);
    const afterDiscount = total - discount;

    let offerText = "";
    if (count < 2) offerText = "Add 1 more item to get 5% off";
    else if (count < 5) offerText = `5% off applied! Add ${5 - count} more item${5 - count === 1 ? "" : "s"} to get 10% off`;
    else offerText = "10% off applied on your whole order!";

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-295 px-5 py-10">
                <h1 className="mb-6 text-[clamp(28px,4vw,40px)] font-black tracking-tight">Your cart</h1>

                {!loaded && <p className="text-muted">Loading...</p>}

                {loaded && items.length === 0 && (
                    <div className="rounded-2xl border border-line bg-card p-10 text-center">
                        <p className="text-lg font-semibold">Your cart is empty</p>
                        <p className="mt-1 text-muted">Find a racket, shoes or shuttles you like.</p>
                        <Link href="/products" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 font-extrabold text-white">
                            Shop products
                        </Link>
                    </div>
                )}

                {loaded && items.length > 0 && (
                    <>
                        {/* discount message */}
                        <div
                            className={`mb-6 rounded-xl px-4 py-3 text-sm font-bold ${discount > 0 ? "bg-green-100 text-green-700" : "bg-brand/10 text-brand"
                                }`}
                        >
                            {offerText}
                        </div>

                        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
                            {/* items */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-4 rounded-2xl border border-line bg-card p-4">
                                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-bg2">
                                            {item.image && (
                                                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">{item.brand}</span>
                                            <Link href={`/products/${item._id}`} className="font-semibold hover:text-brand">
                                                {item.name}
                                            </Link>
                                            <span className="text-sm text-muted">Rs {item.price.toLocaleString()} each</span>

                                            <div className="mt-auto flex items-center justify-between pt-3">
                                                <div className="flex items-center rounded-xl border border-line">
                                                    <button onClick={() => changeQty(item._id, item.qty - 1)} className="h-9 w-9 text-lg font-bold hover:text-brand">−</button>
                                                    <span className="w-8 text-center font-bold">{item.qty}</span>
                                                    <button onClick={() => changeQty(item._id, item.qty + 1)} className="h-9 w-9 text-lg font-bold hover:text-brand">+</button>
                                                </div>
                                                <b className="text-lg">Rs {(item.price * item.qty).toLocaleString()}</b>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            aria-label={`Remove ${item.name}`}
                                            className="self-start rounded-lg px-2 py-1 text-muted hover:text-brand"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button onClick={clearCart} className="text-sm font-bold text-muted hover:text-brand">
                                    Clear cart
                                </button>
                            </div>

                            {/* summary */}
                            <aside className="rounded-2xl border border-line bg-card p-6 lg:sticky lg:top-24">
                                <h2 className="mb-4 text-xl font-black">Order summary</h2>
                                <div className="flex justify-between py-1.5 text-muted">
                                    <span>Subtotal ({count} item{count === 1 ? "" : "s"})</span>
                                    <span>Rs {total.toLocaleString()}</span>
                                </div>
                                <div className={`flex justify-between py-1.5 ${discount > 0 ? "font-semibold text-green-600" : "text-muted"}`}>
                                    <span>Total discount{discount > 0 ? ` (${percent}%)` : ""}</span>
                                    <span>{discount > 0 ? `− Rs ${discount.toLocaleString()}` : "Rs 0"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 text-muted">
                                    <span>Delivery</span>
                                    <span>{delivery === 0 ? "Free" : `Rs ${delivery}`}</span>
                                </div>
                                {delivery > 0 && (
                                    <p className="text-xs text-muted">
                                        Add Rs {(FREE_DELIVERY_OVER - afterDiscount).toLocaleString()} more for free delivery.
                                    </p>
                                )}
                                <div className="mt-3 flex justify-between border-t border-line pt-3 text-xl font-black">
                                    <span>Final amount</span>
                                    <span>Rs {grandTotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <p className="mt-2 text-sm font-bold text-green-600">You save Rs {discount.toLocaleString()}!</p>
                                )}
                                <Link
                                    href="/checkout"
                                    className="mt-5 block rounded-xl bg-brand px-6 py-3.5 text-center text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_var(--color-brand)]"
                                >
                                    Checkout →
                                </Link>
                                <p className="mt-3 text-center text-xs text-muted">Pay on delivery</p>
                            </aside>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}