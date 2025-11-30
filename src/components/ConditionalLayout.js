"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShippingBanner from "@/components/ShippingBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-100 via-white to-zinc-100">
        <ShippingBanner />
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-12 lg:px-8 xl:px-12">
          {children}
        </main>
        <SiteFooter />
      </div>
      <WhatsAppButton />
    </>
  );
}


