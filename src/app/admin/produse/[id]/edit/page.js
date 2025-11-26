"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById, updateProduct } from "@/app/actions/products";
import { checkAdminAccess } from "@/app/actions/admin";
import { getAllCategories } from "@/app/actions/categories";
import MultiImageUpload from "@/components/MultiImageUpload";

export default function EditProductPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    nume: "",
    descriere: "",
    pret: "",
    pret_oferta: "",
    categorii: [],
    culori: "",
    imagini: [],
    noutate: false,
    stoc: true,
    personalizat: false,
  });

  useEffect(() => {
    async function loadProductId() {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    }
    loadProductId();
  }, [params]);

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user && productId) {
        const adminCheck = await checkAdminAccess(user.id);
        setIsAdmin(adminCheck.isAdmin);
        setChecking(false);

        if (!adminCheck.isAdmin) {
          router.push("/");
          return;
        }

        // Încarcă categoriile
        const categoriesResult = await getAllCategories();
        if (categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

        const result = await getProductById(productId);

        if (result.error || !result.data) {
          setError(result.error || "Produsul nu a fost găsit.");
          setLoading(false);
        } else {
          const product = result.data;
          setFormData({
            nume: product.nume,
            descriere: product.descriere,
            pret: product.pret.toString(),
            pret_oferta: product.pret_oferta ? product.pret_oferta.toString() : "",
            categorii: product.categorii || (product.categorie ? [product.categorie] : []),
            culori: product.culori?.join(", ") || "",
            imagini: product.imagini || (product.imagine ? [product.imagine] : []),
            noutate: product.noutate || false,
            stoc: product.stoc !== undefined ? product.stoc : true,
            personalizat: product.personalizat || false,
          });
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        router.push("/autentificare");
      }
    }

    loadData();
  }, [user, authLoading, router, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validare
    if (!formData.nume || !formData.descriere || !formData.pret || formData.imagini.length === 0 || formData.categorii.length === 0) {
      setError("Completează toate câmpurile obligatorii, inclusiv cel puțin o imagine și o categorie.");
      setSaving(false);
      return;
    }

    // Transformă culori în array
    const productData = {
      ...formData,
      pret: parseFloat(formData.pret),
      pret_oferta: formData.pret_oferta ? parseFloat(formData.pret_oferta) : null,
      culori: formData.culori
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
    };

    const result = await updateProduct(productId, productData, user?.id || null);

    if (result.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/admin/produse");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (authLoading || checking || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-zinc-600">
            {checking ? "Se verifică accesul..." : "Se încarcă produsul..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (error && !formData.nume) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-rose-800">{error}</p>
          <Link
            href="/admin/produse"
            className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            ← Înapoi la produse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Editează produs</h1>
          <p className="mt-1 text-sm text-zinc-600">Actualizează informațiile despre produs</p>
        </div>
        <Link
          href="/admin/produse"
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          ← Înapoi
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8">
        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Nume produs *
            <input
              type="text"
              name="nume"
              required
              value={formData.nume}
              onChange={handleChange}
              className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              placeholder="ex: Lampă Orbită"
            />
          </label>
        </div>

        <div>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Descriere *
            <textarea
              name="descriere"
              required
              rows={3}
              value={formData.descriere}
              onChange={handleChange}
              className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white resize-none"
              placeholder="Descrierea produsului..."
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Preț (lei) *
              <input
                type="number"
                name="pret"
                required
                min="0"
                step="0.01"
                value={formData.pret}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="249"
              />
            </label>
          </div>

          <div>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Preț ofertă (lei) - opțional
              <input
                type="number"
                name="pret_oferta"
                min="0"
                step="0.01"
                value={formData.pret_oferta}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="199"
              />
              <span className="mt-1 text-xs text-zinc-500">
                Lasă gol dacă produsul nu este în ofertă
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Categorii *
            <div className="mt-2 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
              {categories.length === 0 ? (
                <p className="text-sm text-zinc-500">Nu există categorii. <Link href="/admin/categorii" className="text-emerald-600 hover:text-emerald-500">Adaugă categorii</Link></p>
              ) : (
                categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categorii.includes(cat.nume)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            categorii: [...formData.categorii, cat.nume],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            categorii: formData.categorii.filter((c) => c !== cat.nume),
                          });
                        }
                      }}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-zinc-800">{cat.nume}</span>
                  </label>
                ))
              )}
            </div>
            {formData.categorii.length === 0 && (
              <p className="mt-1 text-xs text-rose-600">Selectează cel puțin o categorie</p>
            )}
          </label>
        </div>

        <div>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Culori (separate prin virgulă)
            <input
              type="text"
              name="culori"
              value={formData.culori}
              onChange={handleChange}
              className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              placeholder="ex: Grafit, Ivory, Verde mentă"
            />
          </label>
        </div>


        <div>
          <MultiImageUpload
            value={formData.imagini}
            onChange={(imagini) => setFormData({ ...formData, imagini })}
            label="Imagini produs"
          />
          {formData.imagini.length > 0 && (
            <input type="hidden" name="imagini" value={JSON.stringify(formData.imagini)} required />
          )}
        </div>

        <div className="flex gap-6 flex-wrap">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="noutate"
              checked={formData.noutate}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-700">Produs nou</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="stoc"
              checked={formData.stoc}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-700">În stoc</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="personalizat"
              checked={formData.personalizat}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-700">Produs personalizat</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t border-zinc-200">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Salvez..." : "Salvează modificările"}
          </button>
          <Link
            href="/admin/produse"
            className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Anulează
          </Link>
        </div>
      </form>
    </div>
  );
}

