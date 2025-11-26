import { Geist, Geist_Mono, Orbitron } from "next/font/google";
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

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Creating Layers | Produse românești",
    template: "%s | Creating Layers",
  },
  description: "Magazin online românesc cu produse de calitate - livrare rapidă și plată ramburs. Produse personalizate disponibile.",
  keywords: [
    "produse românești",
    "magazin online",
    "livrare gratuită",
    "plata ramburs",
    "produse personalizate",
    "produse printate 3d",
    "suporturi bahare masini",
    "accesorii auto",
    "Creating Layers"
  ],
  authors: [{ name: "Creating Layers" }],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://creatinglayers.ro",
    siteName: "Creating Layers",
    title: "Creating Layers | Produse românești",
    description: "Magazin online românesc cu produse de calitate - livrare rapidă și plată ramburs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creating Layers",
    description: "Magazin online românesc cu produse de calitate",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}>
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
