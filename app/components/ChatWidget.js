"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

const GREETING = "Hi! I'm the SmashCart assistant. Ask me about rackets, shuttles, delivery or discounts.";
const SUGGESTIONS = ["Rackets under Rs 10,000", "Delivery charges?", "What discounts do you have?"];

const BTN = 56; // button size in px
const EDGE = 20; // gap from the screen edge in px
const POS_KEY = "smashcart-chat-pos";

// keeps the button low enough that the chat window still fits above it
function clampBottom(b) {
    const max = Math.max(EDGE, window.innerHeight - 400);
    return Math.min(Math.max(b, EDGE), max);
}

export default function ChatWidget() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: "bot", text: GREETING }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [side, setSide] = useState("right"); // which side of the screen the button is on
    const [bottom, setBottom] = useState(EDGE); // distance from the bottom of the screen
    const [drag, setDrag] = useState(null); // while dragging: the top-left corner of the button

    const endRef = useRef(null);
    const press = useRef(null); // info about the finger or mouse that is pressing the button
    const justDragged = useRef(false);

    // load the position the customer chose last time
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(POS_KEY) || "null");
            if (saved && (saved.side === "left" || saved.side === "right")) {
                setSide(saved.side);
                setBottom(clampBottom(Number(saved.bottom) || EDGE));
            }
        } catch {
            // ignore: the button just starts on the right
        }
    }, []);

    // keep the newest message in view
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, open]);

    // the admin pages do not need the chatbot
    if (pathname.startsWith("/admin")) return null;

    // ---------- moving the button ----------
    function cornerFrom(e) {
        return {
            x: Math.min(Math.max(e.clientX - BTN / 2, 0), window.innerWidth - BTN),
            y: Math.min(Math.max(e.clientY - BTN / 2, 0), window.innerHeight - BTN),
        };
    }

    function onPointerDown(e) {
        press.current = { startX: e.clientX, startY: e.clientY, moved: false };
        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        const p = press.current;
        if (!p) return;
        // small shakes are still a click, not a drag
        if (!p.moved && Math.hypot(e.clientX - p.startX, e.clientY - p.startY) < 6) return;
        if (!p.moved) {
            p.moved = true;
            setOpen(false);
        }
        setDrag(cornerFrom(e));
    }

    function onPointerUp(e) {
        const p = press.current;
        press.current = null;
        if (!p || !p.moved) return;

        justDragged.current = true; // so the click that follows does not open the chat
        setTimeout(() => (justDragged.current = false), 50);

        const { x, y } = cornerFrom(e);
        const newSide = x + BTN / 2 < window.innerWidth / 2 ? "left" : "right";
        const newBottom = clampBottom(window.innerHeight - (y + BTN));
        setSide(newSide);
        setBottom(newBottom);
        setDrag(null);
        try {
            localStorage.setItem(POS_KEY, JSON.stringify({ side: newSide, bottom: newBottom }));
        } catch {
            // ignore
        }
    }

    function onPointerCancel() {
        press.current = null;
        setDrag(null);
    }

    function onClick() {
        if (justDragged.current) return;
        setOpen((o) => !o);
    }

    // ---------- sending messages ----------
    async function send(text) {
        const clean = text.trim();
        if (!clean || loading) return;

        const next = [...messages, { role: "user", text: clean }];
        setMessages(next);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: next }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            setMessages([...next, { role: "bot", text: data.reply }]);
        } catch (err) {
            const msg = err.message === "Failed to fetch" ? "I cannot reach the server right now. Please try again in a moment." : err.message;
            setMessages([...next, { role: "bot", text: msg }]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        send(input);
    }

    const buttonStyle = drag ? { left: drag.x, top: drag.y } : { [side]: EDGE, bottom };
    const panelBottom = bottom + BTN + 12;

    return (
        <>
            {/* chat window: opens above the button, on the same side */}
            {open && (
                <div
                    style={{ [side]: EDGE, bottom: panelBottom, maxHeight: `calc(100vh - ${panelBottom + 16}px)` }}
                    className="fixed z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
                >
                    <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
                        <div>
                            <p className="font-black leading-tight">SmashCart Assistant</p>
                            <p className="text-xs opacity-90">Ask about products, delivery and discounts</p>
                        </div>
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-white/20">
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto bg-bg p-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <p
                                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "rounded-br-sm bg-brand text-white" : "rounded-bl-sm border border-line bg-card"
                                        }`}
                                >
                                    {m.text}
                                </p>
                            </div>
                        ))}

                        {/* quick questions (only before the customer writes anything) */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button key={s} onClick={() => send(s)} className="cursor-pointer rounded-full border border-brand px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand hover:text-white">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <p className="rounded-2xl rounded-bl-sm border border-line bg-card px-4 py-2.5 text-sm text-muted">Typing...</p>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line bg-card p-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            maxLength={500}
                            placeholder="Type your question..."
                            className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                    <p className="bg-card px-3 pb-2.5 text-center text-[11px] text-muted">Chats may be saved to improve our service.</p>
                </div>
            )}

            {/* the round button: click to chat, drag to move it */}
            <button
                onClick={onClick}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                style={buttonStyle}
                title="Chat with us (drag to move)"
                aria-label={open ? "Close chat" : "Open chat"}
                className={`fixed z-40 flex h-14 w-14 touch-none select-none items-center justify-center rounded-full bg-brand text-white shadow-lg ${drag ? "cursor-grabbing scale-110" : "cursor-grab transition hover:scale-105"}`}
            >
                {open ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </>
    );
}