"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

export default function ProductCategoryTabs({ produse, categorii }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("categorie");
  
  // Setează categoria inițială din URL sau "toate"
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "toate"
  );

  // Actualizează categoria când se schimbă URL-ul (ex: back/forward în browser)
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categorie");
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    } else if (!categoryFromUrl && selectedCategory !== "toate") {
      setSelectedCategory("toate");
    }
  }, [searchParams]);

  // Funcție pentru schimbarea categoriei și actualizarea URL-ului
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "toate") {
      // Șterge parametrul din URL dacă e "toate"
      router.push("/", { scroll: false });
    } else if (category === "personalizate") {
      // Tab special pentru produse personalizate
      router.push(`/?categorie=personalizate`, { scroll: false });
    } else {
      // Adaugă parametrul în URL
      router.push(`/?categorie=${encodeURIComponent(category)}`, { scroll: false });
    }
  };

  // Filtrează produsele în funcție de categorie
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "toate") {
      return produse;
    }
    if (selectedCategory === "personalizate") {
      // Filtrează doar produsele personalizate
      return produse.filter((produs) => produs.personalizat === true);
    }
    return produse.filter((produs) => {
      // Verifică dacă produsul are categoria selectată în array-ul de categorii
      return produs.categorii && produs.categorii.includes(selectedCategory);
    });
  }, [produse, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header cu titlu și categorii */}
      <div className="space-y-4 lg:space-y-0">
        {/* Pe mobil: titlu separat, pe desktop: titlu și categorii pe aceeași linie */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
            <h1 className="text-4xl font-semibold text-zinc-900">Produsele noastre</h1>
          </div>
          {/* Taburi pentru categorii - pe desktop lângă titlu */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0 scrollbar-hide lg:border-0 border-b border-zinc-200 lg:pt-0 pt-4">
            <button
              onClick={() => handleCategoryChange("toate")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                selectedCategory === "toate"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Toate
            </button>
            <button
              onClick={() => handleCategoryChange("personalizate")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                selectedCategory === "personalizate"
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Personalizate
            </button>
            {categorii.map((categorie) => (
              <button
                key={categorie.id}
                onClick={() => handleCategoryChange(categorie.nume)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === categorie.nume
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {categorie.nume}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid cu produse filtrate */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center">
          <p className="text-lg font-semibold text-zinc-900">
            Nu există produse în această categorie
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:gap-8 lg:grid-cols-3">
          {filteredProducts.map((produs) => (
            <ProductCard key={produs.id} produs={produs} />
          ))}
        </div>
      )}
    </div>
  );
}

