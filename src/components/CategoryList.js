"use client";

import Link from "next/link";
import { HomeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getCategoryIcon } from "@/lib/categoryIcons";

/**
 * Componentă reutilizabilă pentru lista de categorii în drawer
 * 
 * @param {Array} categorii - Array de categorii
 * @param {string|function} selectedCategory - Categoria selectată sau funcție pentru verificare
 * @param {function} onCategoryClick - Funcție apelată când se dă click pe o categorie
 * @param {boolean} useLinks - Dacă true, folosește Link-uri, altfel folosește butoane
 * @param {boolean} loading - Dacă true, afișează loading state
 */
export default function CategoryList({
  categorii = [],
  selectedCategory,
  onCategoryClick,
  useLinks = false,
  loading = false,
}) {
  // Funcție helper pentru a verifica dacă o categorie este activă
  const isActive = (categoryName) => {
    if (typeof selectedCategory === "function") {
      // Pentru SiteHeader: isCategoryActive este o funcție care verifică categoria din URL
      return selectedCategory(categoryName);
    }
    // Pentru ProductCategoryTabs: comparăm direct cu selectedCategory
    if (categoryName === "toate") {
      return !selectedCategory || selectedCategory === "toate";
    }
    return selectedCategory === categoryName;
  };

  // Component pentru "Toate produsele"
  const AllProductsItem = ({ isActive }) => {
    const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "text-emerald-300"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;
    const iconClassName = `h-5 w-5 flex-shrink-0 ${
      isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
    }`;

    if (useLinks) {
      return (
        <Link href="/" onClick={onCategoryClick} className={`group ${className}`}>
          <HomeIcon className={iconClassName} />
          Toate produsele
        </Link>
      );
    }

    return (
      <button onClick={() => onCategoryClick("toate")} className={className}>
        <HomeIcon className={iconClassName} />
        Toate produsele
      </button>
    );
  };

  // Component pentru "Personalizate"
  const PersonalizedItem = ({ isActive }) => {
    const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "text-purple-300"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;
    const iconClassName = `h-5 w-5 flex-shrink-0 ${
      isActive ? "text-purple-400" : "text-zinc-400 group-hover:text-zinc-300"
    }`;

    if (useLinks) {
      return (
        <Link
          href="/?categorie=personalizate"
          onClick={onCategoryClick}
          className={`group ${className}`}
        >
          <SparklesIcon className={iconClassName} />
          Personalizate
        </Link>
      );
    }

    return (
      <button onClick={() => onCategoryClick("personalizate")} className={className}>
        <SparklesIcon className={iconClassName} />
        Personalizate
      </button>
    );
  };

  return (
    <div className="px-4 py-4">
      <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Categorii
      </p>
      <nav className="space-y-1">
        <AllProductsItem isActive={isActive("toate")} />
        <PersonalizedItem isActive={isActive("personalizate")} />
        
        {loading ? (
          <div className="px-3 py-2.5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500"></div>
          </div>
        ) : (
          categorii.map((categorie) => {
            const CategoryIcon = getCategoryIcon(categorie.nume);
            const categoryIsActive = isActive(categorie.nume);
            const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              categoryIsActive
                ? "text-emerald-300"
                : "text-zinc-300 hover:bg-white/5 hover:text-white"
            }`;
            const iconClassName = `h-5 w-5 flex-shrink-0 ${
              categoryIsActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
            }`;

            if (useLinks) {
              return (
                <Link
                  key={categorie.id}
                  href={`/?categorie=${encodeURIComponent(categorie.nume)}`}
                  onClick={onCategoryClick}
                  className={`group ${className}`}
                >
                  <CategoryIcon className={iconClassName} />
                  {categorie.nume}
                </Link>
              );
            }

            return (
              <button
                key={categorie.id}
                onClick={() => onCategoryClick(categorie.nume)}
                className={className}
              >
                <CategoryIcon className={iconClassName} />
                {categorie.nume}
              </button>
            );
          })
        )}
      </nav>
    </div>
  );
}
