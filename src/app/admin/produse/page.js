"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/app/actions/products";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, inStock, outOfStock

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.nume.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descriere?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categorie?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && product.stoc) ||
        (stockFilter === "outOfStock" && !product.stoc);

      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, stockFilter]);

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Ești sigur că vrei să ștergi produsul "${productName}"?`)) {
      return;
    }

    const result = await deleteProduct(productId, user?.id || null);

    if (result.error) {
      showToast(result.error, "error");
    } else {
      setProducts(products.filter((p) => p.id !== productId));
      showToast(`Produsul "${productName}" a fost șters cu succes.`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Produse</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produs" : "produse"}
          </p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adaugă produs
        </Link>
      </div>

      {/* Filtre și căutare */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Caută produse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2.5 border border-zinc-300 rounded-lg bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Toate produsele</option>
          <option value="inStock">În stoc</option>
          <option value="outOfStock">Fără stoc</option>
        </select>
      </div>

      {/* Tabel produse */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Produs
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Preț
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Stoc
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    {searchQuery || stockFilter !== "all" ? (
                      "Nu s-au găsit produse care să corespundă filtrelor."
                    ) : (
                      <>
                        Nu există produse.{" "}
                        <Link href="/admin/produse/nou" className="font-semibold text-emerald-600 hover:text-emerald-500">
                          Adaugă primul produs
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition">
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
                    <td className="px-6 py-4 text-sm text-zinc-600">{product.categorie || "-"}</td>
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
                          onClick={() => handleDelete(product.id, product.nume)}
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
    </div>
  );
}
