"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { checkAdminAccess } from "@/app/actions/admin";

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      if (!authLoading) {
        if (!user) {
          router.push("/autentificare");
          return;
        }

        const result = await checkAdminAccess(user.id);
        setIsAdmin(result.isAdmin);
        setChecking(false);

        if (!result.isAdmin) {
          router.push("/");
        }
      }
    }

    verifyAdmin();
  }, [user, authLoading, router]);

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-zinc-600">Se verifică accesul...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { href: "/admin/produse", label: "Produse", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { href: "/admin/comenzi", label: "Comenzi", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/admin/categorii", label: "Categorii", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { href: "/admin/newsletter", label: "Newsletter", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-zinc-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-zinc-900 font-[family-name:var(--font-orbitron)] tracking-tight">
                Admin Panel
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-zinc-200 p-4">
            <Link
              href="/"
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                    Înapoi la magazin
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-zinc-200 lg:hidden">
          <button
            type="button"
            className="px-4 border-r border-zinc-200 text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
          >
            <span className="sr-only">Deschide sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex">
              <span className="text-lg font-semibold text-zinc-900 font-[family-name:var(--font-orbitron)] tracking-tight">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

