import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "SmashCart | Badminton gear",
  description: "Rackets, shuttlecocks, shoes and bags for every badminton player.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg font-sans text-ink antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}