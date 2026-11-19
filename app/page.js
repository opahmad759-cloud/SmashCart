import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandStrip from "./components/BrandStrip";
import ProductMarquee from "./components/ProductMarquee";
import Why from "./components/Why";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <BrandStrip />
                <ProductMarquee />
                <Why />
                <Reviews />
            </main>
            <Footer />
        </>
    );
}