"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllCategories, createCategory, deleteCategory } from "@/app/actions/categories";
import { checkAdminAccess } from "@/app/actions/admin";

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
        const adminCheck = await checkAdminAccess(user.id);
        setIsAdmin(adminCheck.isAdmin);

        if (!adminCheck.isAdmin) {
          router.push("/");
          return;
        }

        const result = await getAllCategories();
        if (result.data) {
          setCategories(result.data);
        }
        setLoading(false);
      } else if (!authLoading && !user) {
        router.push("/autentificare");
      }
    }

    loadData();
  }, [user, authLoading, router]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Numele categoriei este obligatoriu.");
      return;
    }

    setIsAdding(true);
    setError(null);

    const result = await createCategory(newCategoryName.trim(), user?.id || null);

    if (result.error) {
      setError(result.error);
      setIsAdding(false);
    } else {
      setNewCategoryName("");
      // Reîncarcă categoriile
      const refreshResult = await getAllCategories();
      if (refreshResult.data) {
        setCategories(refreshResult.data);
      }
      setIsAdding(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Ești sigur că vrei să ștergi această categorie?")) {
      return;
    }

    const result = await deleteCategory(categoryId, user?.id || null);

    if (result.error) {
      alert(result.error);
    } else {
      setCategories(categories.filter((c) => c.id !== categoryId));
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
          <h1 className="text-3xl font-semibold text-zinc-900">Gestionare categorii</h1>
          <p className="mt-1 text-sm text-zinc-600">Gestionează categoriile de produse</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500"
        >
          ← Înapoi la panou
        </Link>
      </div>

      {/* Formular pentru adăugare categorie */}
      <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Adaugă categorie nouă</h2>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              setError(null);
            }}
            placeholder="Nume categorie"
            className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Se adaugă..." : "+ Adaugă"}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-rose-600">{error}</p>
        )}
      </div>

      {/* Lista categoriilor */}
      <div className="rounded-3xl border border-zinc-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Nume categorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Data creării
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-zinc-500">
                    Nu există categorii. Adaugă prima categorie folosind formularul de mai sus.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900">{category.nume}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {new Date(category.created_at).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Șterge
                      </button>
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

