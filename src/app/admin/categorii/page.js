"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories, createCategory, deleteCategory } from "@/app/actions/categories";
import { useToast } from "@/context/ToastContext";

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
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
      showToast("Numele categoriei este obligatoriu.", "error");
      return;
    }

    setIsAdding(true);

    const result = await createCategory(newCategoryName.trim(), user?.id || null);

    if (result.error) {
      showToast(result.error, "error");
      setIsAdding(false);
    } else {
      setNewCategoryName("");
      // Reîncarcă categoriile
      const refreshResult = await getAllCategories();
      if (refreshResult.data) {
        setCategories(refreshResult.data);
      }
      showToast(`Categoria "${newCategoryName.trim()}" a fost adăugată cu succes.`);
      setIsAdding(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Ești sigur că vrei să ștergi categoria "${categoryName}"?`)) {
      return;
    }

    const result = await deleteCategory(categoryId, user?.id || null);

    if (result.error) {
      showToast(result.error, "error");
    } else {
      setCategories(categories.filter((c) => c.id !== categoryId));
      showToast(`Categoria "${categoryName}" a fost ștearsă cu succes.`);
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
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Categorii</h1>
        <p className="mt-1 text-sm text-zinc-600">Gestionează categoriile de produse</p>
      </div>

      {/* Formular pentru adăugare categorie */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Adaugă categorie nouă</h2>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nume categorie"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Se adaugă..." : "+ Adaugă"}
          </button>
        </form>
      </div>

      {/* Lista categoriilor */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Nume categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Data creării
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
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
                  <tr key={category.id} className="hover:bg-zinc-50 transition">
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
                        onClick={() => handleDelete(category.id, category.nume)}
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
