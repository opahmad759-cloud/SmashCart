import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Suspense } from "react";
import ChatWidget from "./components/ChatWidget";

export const metadata = {
  metadataBase: new URL("https://smash-cart.vercel.app"),
  title: "SmashCart | Badminton gear",
  description: "Rackets, shuttlecocks, shoes and bags for every badminton player.",
  verification: {
    google: "RMmfCsI9jMF_Imv9xUVND5UKaHljPAbOciOB35NmQMM",
  },
};;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg font-sans text-ink antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </body>
    </html>
  );
}