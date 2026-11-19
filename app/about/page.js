"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;
const inputClass = "w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-brand";

const values = [
  { icon: "🏸", title: "Made by a player", text: "Every product on this site is picked by someone who actually plays badminton every Saturday." },
  { icon: "💵", title: "Cash on delivery", text: "No card needed. You pay in cash when your order arrives." },
  { icon: "🔒", title: "Safe shopping", text: "Passwords are hashed, orders are checked on the server, and prices cannot be changed from the browser." },
];

export default function AboutPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // hidden trap for spam bots
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  // fill in the name and email from the account (once)
  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setEmail((e) => e || user.email);
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Save in MongoDB (so the admin Messages page can use it later)
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // 2) Send to your email through Web3Forms (a failure here must not break the form)
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "New SmashCart contact message",
          from_name: name,
          name,
          email,
          message,
        }),
      }).catch(() => { });

      // 3) Show the thank-you message and clear the message box
      setSent(data.message || "Thank you! We will get back to you soon.");
      setMessage("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main>
        {/* about */}
        <section className="mx-auto max-w-295 px-5 py-14">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">About us</p>
          <h1 className="my-1.5 max-w-3xl text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tight">
            Badminton gear from a player who plays every Saturday.
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] text-muted">
            SmashCart is a sample badminton store built by Ahmad Mehboob, a university player who loves the game. It is a
            portfolio project: the products, prices and reviews are sample data, and the shop itself (accounts, cart,
            checkout, orders) is built for real with Next.js, Express and MongoDB.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[20px] border border-line bg-card p-7">
                <div className="mb-3.5 flex h-13 w-13 items-center justify-center rounded-2xl bg-brand/15 text-2xl">{v.icon}</div>
                <b className="text-[19px]">{v.title}</b>
                <p className="mt-1.5 text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* contact */}
        <section id="contact" className="mx-auto max-w-295 px-5 pb-16">
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-card p-8">
            <h2 className="text-3xl font-black tracking-tight">Contact us</h2>
            <p className="mt-1 text-muted">Questions about a product or an order? Send us a message.</p>

            {sent ? (
              <div className="mt-6">
                <p className="rounded-xl bg-green-100 px-4 py-3 font-semibold text-green-700">{sent}</p>
                <button onClick={() => setSent("")} className="mt-4 text-sm font-bold text-brand hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold">Your name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold">Message</label>
                  <textarea
                    required
                    rows={5}
                    minLength={10}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>

                {/* hidden trap: real people never see or fill this */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="absolute -left-2499.75 h-0 w-0 opacity-0"
                />

                {error && <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand px-6 py-3.5 text-lg font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}