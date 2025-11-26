"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/app/actions/products";
import { checkAdminAccess } from "@/app/actions/admin";

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
        const adminCheck = await checkAdminAccess(user.id);
        setIsAdmin(adminCheck.isAdmin);

        if (!adminCheck.isAdmin) {
          router.push("/");
          return;
        }

        const result = await getAllProducts();
        if (result.data) {
          setProducts(result.data);
        }
        setLoading(false);
      } else if (!authLoading && !user) {
        router.push("/autentificare");
      }
    }

    loadData();
  }, [user, authLoading, router]);

  const handleDelete = async (productId) => {
    if (!confirm("Ești sigur că vrei să ștergi acest produs?")) {
      return;
    }

    const result = await deleteProduct(productId, user?.id || null);

    if (result.error) {
      alert(result.error);
    } else {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-zinc-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Gestionare produse</h1>
          <p className="mt-1 text-sm text-zinc-600">Gestionează produsele din catalog</p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          + Adaugă produs
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Produs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Categorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Preț
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Stoc
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    Nu există produse.{" "}
                    <Link href="/admin/produse/nou" className="font-semibold text-emerald-600 hover:text-emerald-500">
                      Adaugă primul produs
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                          <img
                            src={product.imagine}
                            alt={product.nume}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-zinc-900 truncate">{product.nume}</p>
                          <p className="text-sm text-zinc-500 line-clamp-1">{product.descriere}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{product.categorie}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                      {product.pret} lei
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stoc
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {product.stoc ? "În stoc" : "La comandă"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produse/${product.id}/edit`}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          Editează
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Link
        href="/admin"
        className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500"
      >
        ← Înapoi la panou
      </Link>
    </div>
  );
}




