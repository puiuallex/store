import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShippingBanner from "@/components/ShippingBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Creating Layers | Produse românești",
  description:
    "Magazin online românesc cu produse de calitate - livrare rapidă și plată ramburs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-100 via-white to-zinc-100">
                <ShippingBanner />
                <SiteHeader />
                <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-16 lg:px-8">
                  {children}
                </main>
                <SiteFooter />
              </div>
              <WhatsAppButton />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
