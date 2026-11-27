export default function sitemap() {
    const base = "https://smash-cart.vercel.app";
    const pages = [
        "",
        "/products",
        "/products?category=racket",
        "/products?category=shuttle",
        "/products?category=shoes",
        "/products?category=bag",
        "/about",
    ];
    return pages.map((p) => ({ url: base + p, lastModified: new Date() }));
}