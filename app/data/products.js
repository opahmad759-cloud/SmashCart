// Sample data. Later we replace this with a fetch to your Express API.
export const products = [
    // Rackets (4)
    { id: 1, name: "Nanoflare 700 Pro", brand: "Yonex", level: "Advanced", category: "racket", price: 45000, oldPrice: 52000, tag: "-13%", emoji: "🏸", image: "/images/products/racket-1.jpg", rating: 4.9, reviews: 128 },
    { id: 2, name: "Light Series Racket", brand: "Li-Ning", level: "Beginner", category: "racket", price: 9500, emoji: "🏸", image: "/images/products/racket-2.jpg", rating: 4.5, reviews: 84 },
    { id: 3, name: "Astrox Racket", brand: "Yonex", level: "Advanced", category: "racket", price: 39000, emoji: "🏸", image: "/images/products/racket-3.jpg", rating: 4.9, reviews: 96 },
    { id: 4, name: "Black Series Racket", brand: "Li-Ning", level: "Intermediate", category: "racket", price: 7500, oldPrice: 9000, tag: "Sale", emoji: "🏸", image: "/images/products/racket-4.jpg", rating: 4.5, reviews: 142 },

    // Shuttlecock tubes (3)
    { id: 5, name: "Mavis 350 (Nylon)", brand: "Yonex", level: "All levels", category: "shuttle", price: 2400, emoji: "🪶", image: "/images/products/shuttle-1.jpg", rating: 4.8, reviews: 211 },
    { id: 6, name: "Master Ace Feather", brand: "Victor", level: "Advanced", category: "shuttle", price: 6200, emoji: "🪶", image: "/images/products/shuttle-2.jpg", rating: 4.7, reviews: 310 },
    { id: 7, name: "Queen Feather", brand: "Victor", level: "Intermediate", category: "shuttle", price: 3400, emoji: "🪶", image: "/images/products/shuttle-3.jpg", rating: 4.6, reviews: 120 },

    // Shoes (3)
    { id: 8, name: "Court Shoes Blue", brand: "Yonex", level: "Beginner", category: "shoes", price: 12900, oldPrice: 15000, tag: "-14%", emoji: "👟", image: "/images/products/shoes-1.jpg", rating: 4.6, reviews: 57 },
    { id: 9, name: "UVO Blast IV", brand: "UVO", level: "Intermediate", category: "shoes", price: 14500, emoji: "👟", image: "/images/products/shoes-2.jpg", rating: 4.8, reviews: 73 },
    { id: 10, name: "Gel-Rocket 11", brand: "ASICS", level: "Advanced", category: "shoes", price: 27000, emoji: "👟", image: "/images/products/shoes-3.jpg", rating: 4.7, reviews: 64 },

    // Bags (2)
    { id: 11, name: "Racket Bag 6-Pack", brand: "Kumpoo", level: "All levels", category: "bag", price: 8900, emoji: "🎒", image: "/images/products/bag-1.jpg", rating: 4.5, reviews: 48 },
    { id: 12, name: "Active Racket Bag", brand: "Yonex", level: "All levels", category: "bag", price: 14500, emoji: "🎒", image: "/images/products/bag-2.jpg", rating: 4.7, reviews: 39 },
];

export const brands = ["YONEX", "LI-NING", "VICTOR", "ASICS", "KUMPOO", "CARLTON"];

export const tabs = [
    { key: "all", label: "All" },
    { key: "racket", label: "Rackets" },
    { key: "shuttle", label: "Shuttles" },
    { key: "shoes", label: "Shoes" },
    { key: "bag", label: "Bags" },
];