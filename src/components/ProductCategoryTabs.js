"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  HomeIcon,
  SparklesIcon,
  TagIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";

// Funcție helper pentru a obține iconul potrivit pentru fiecare categorie
function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  
  if (name.includes("birou")) {
    return BuildingOfficeIcon;
  }
  if (name.includes("auto")) {
    return BoltIcon;
  }
  if (name.includes("scule") || name.includes("unelte")) {
    return WrenchScrewdriverIcon;
  }
  
  // Icon default pentru restul categoriilor
  return TagIcon;
}

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
    <div className="space-y-4 lg:space-y-0">
      {/* Header cu titlu - doar pe mobil */}
      <div className="lg:hidden space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Produsele noastre</h1>
      </div>

      {/* Layout desktop: sidebar cu categorii + produse */}
      <div className="lg:flex lg:gap-8">
        {/* Sidebar cu categorii - doar pe desktop */}
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-4">Catalog</p>
              <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Produsele noastre</h1>
            </div>
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => handleCategoryChange("toate")}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === "toate"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <HomeIcon className={`h-5 w-5 flex-shrink-0 ${
                  selectedCategory === "toate" ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600"
                }`} />
                Toate produsele
              </Link>
              <Link
                href="/?categorie=personalizate"
                onClick={() => handleCategoryChange("personalizate")}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === "personalizate"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <SparklesIcon className={`h-5 w-5 flex-shrink-0 ${
                  selectedCategory === "personalizate" ? "text-purple-600" : "text-zinc-400 group-hover:text-zinc-600"
                }`} />
                Personalizate
              </Link>
              {categorii.map((categorie) => {
                const CategoryIcon = getCategoryIcon(categorie.nume);
                return (
                  <Link
                    key={categorie.id}
                    href={`/?categorie=${encodeURIComponent(categorie.nume)}`}
                    onClick={() => handleCategoryChange(categorie.nume)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === categorie.nume
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <CategoryIcon className={`h-5 w-5 flex-shrink-0 ${
                      selectedCategory === categorie.nume ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600"
                    }`} />
                    {categorie.nume}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Conținut principal - produse */}
        <div className="flex-1 min-w-0">
          {/* Taburi pentru categorii - doar pe mobil */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 scrollbar-hide border-b border-zinc-200 mb-4">
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

          {/* Grid cu produse filtrate */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                Nu există produse în această categorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-3">
              {filteredProducts.map((produs) => (
                <ProductCard key={produs.id} produs={produs} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

