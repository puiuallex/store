"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkAdminAccess } from "@/app/actions/admin";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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
      <div className="flex min-h-[60vh] items-center justify-center">
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

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-zinc-900">Panou de administrare</h1>
        <p className="text-zinc-600">Gestionează produsele și comenzile magazinului.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gestionare produse */}
        <Link
          href="/admin/produse"
          className="group rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:border-emerald-300 hover:shadow-[0_25px_70px_rgba(16,185,129,0.12)]"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600">
            Gestionare produse
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Adaugă, editează sau șterge produse din catalog.
          </p>
        </Link>

        {/* Gestionare comenzi */}
        <Link
          href="/admin/comenzi"
          className="group rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:border-emerald-300 hover:shadow-[0_25px_70px_rgba(16,185,129,0.12)]"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-600">
            Gestionare comenzi
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Vezi și gestionează comenzile clienților.
          </p>
        </Link>

        {/* Statistici */}
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">Statistici</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Vezi statistici despre vânzări și produse.
          </p>
          <p className="mt-4 text-xs text-zinc-500">În curând...</p>
        </div>
      </div>
    </div>
  );
}

