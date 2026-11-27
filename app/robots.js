export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/cart", "/checkout", "/orders", "/profile", "/order-success", "/reset-password", "/forgot-password"],
        },
        sitemap: "https://smash-cart.vercel.app/sitemap.xml",
    };
}