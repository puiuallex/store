"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  HomeIcon,
  SparklesIcon,
  FunnelIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function ProductCategoryTabs({ produse, categorii }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("categorie");
  
  // Setează categoria inițială din URL sau "toate"
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "toate"
  );
  
  // State pentru drawer-ul de categorii pe mobil
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  const handleCategoryChange = (category, e) => {
    // Previne comportamentul default al link-ului pentru a evita dublă navigare
    if (e) {
      e.preventDefault();
    }
    
    setSelectedCategory(category);
    // Închide drawer-ul pe mobil după selectare
    setIsFilterOpen(false);
    
    if (category === "toate") {
      // Șterge parametrul din URL dacă e "toate"
      router.replace("/", { scroll: false });
    } else if (category === "personalizate") {
      // Tab special pentru produse personalizate
      router.replace(`/?categorie=personalizate`, { scroll: false });
    } else {
      // Adaugă parametrul în URL
      router.replace(`/?categorie=${encodeURIComponent(category)}`, { scroll: false });
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
      {/* Header cu titlu și buton filtru - doar pe mobil */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors duration-150 ease-in-out"
        >
          <FunnelIcon className="h-4 w-4" />
          <span className="font-medium text-sm">
            {selectedCategory === "toate" 
              ? "Filtrare" 
              : selectedCategory === "personalizate"
              ? "Personalizate"
              : selectedCategory}
          </span>
        </button>
        <span className="text-sm text-zinc-500 font-medium">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produs' : 'produse'}
        </span>
      </div>

      {/* Layout desktop: sidebar cu categorii + produse */}
      <div className="lg:flex lg:gap-8">
        {/* Sidebar cu categorii - doar pe desktop */}
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-4">Produse</p>
            </div>
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={(e) => handleCategoryChange("toate", e)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                  selectedCategory === "toate"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                }`}
              >
                <HomeIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
                  selectedCategory === "toate" ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600"
                }`} />
                Toate produsele
              </Link>
              <Link
                href="/?categorie=personalizate"
                onClick={(e) => handleCategoryChange("personalizate", e)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                  selectedCategory === "personalizate"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                }`}
              >
                <SparklesIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
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
                    onClick={(e) => handleCategoryChange(categorie.nume, e)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                      selectedCategory === categorie.nume
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    <CategoryIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
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
          {/* Drawer pentru categorii pe mobil */}
          {isFilterOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
              {/* Drawer */}
              <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900">Categorii</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-zinc-600" />
                  </button>
                </div>
                <nav className="p-4 space-y-1">
                  <button
                    onClick={() => handleCategoryChange("toate")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                      selectedCategory === "toate"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    <HomeIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
                      selectedCategory === "toate" ? "text-emerald-600" : "text-zinc-400"
                    }`} />
                    Toate produsele
                  </button>
                  <button
                    onClick={() => handleCategoryChange("personalizate")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                      selectedCategory === "personalizate"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    <SparklesIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
                      selectedCategory === "personalizate" ? "text-purple-600" : "text-zinc-400"
                    }`} />
                    Personalizate
                  </button>
                  {categorii.map((categorie) => {
                    const CategoryIcon = getCategoryIcon(categorie.nume);
                    return (
                      <button
                        key={categorie.id}
                        onClick={() => handleCategoryChange(categorie.nume)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[colors,border-color] duration-150 ease-in-out border ${
                          selectedCategory === categorie.nume
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                        }`}
                      >
                        <CategoryIcon className={`h-5 w-5 flex-shrink-0 transition-colors duration-150 ease-in-out ${
                          selectedCategory === categorie.nume ? "text-emerald-600" : "text-zinc-400"
                        }`} />
                        {categorie.nume}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </>
          )}

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
