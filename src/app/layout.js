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
  metadataBase: new URL("https://creatinglayers.ro"),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://creatinglayers.ro",
    siteName: "Creating Layers",
    title: "Creating Layers | Produse românești",
    description: "Magazin online românesc cu produse de calitate - livrare rapidă și plată ramburs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Creating Layers - Produse românești",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creating Layers | Produse românești",
    description: "Magazin online românesc cu produse de calitate",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured Data pentru Organization și WebSite
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Creating Layers",
  "url": "https://creatinglayers.ro",
  "logo": "https://creatinglayers.ro/logo.png",
  "description": "Magazin online românesc cu produse de calitate - livrare rapidă și plată ramburs",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Iași",
    "addressCountry": "RO"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-786-089-834",
    "contactType": "customer service",
    "areaServed": "RO",
    "availableLanguage": "ro"
  },
  "sameAs": []
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Creating Layers",
  "url": "https://creatinglayers.ro",
  "description": "Magazin online românesc cu produse de calitate",
  "publisher": {
    "@type": "Organization",
    "name": "Creating Layers"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://creatinglayers.ro/?categorie={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
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
