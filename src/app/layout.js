import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
        <GoogleAnalytics />
        <AuthProvider>
          <CartProvider>
            <CategoriesProvider>
              <ToastProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </ToastProvider>
            </CategoriesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
