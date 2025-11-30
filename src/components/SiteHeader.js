"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { 
  Bars3Icon, 
  UserCircleIcon, 
  ChevronDownIcon, 
  ShoppingCartIcon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  PhoneIcon,
  SparklesIcon,
  TagIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoriesContext";

const links = [
  { href: "/", label: "Magazin", icon: ShoppingBagIcon },
  { href: "/livrare", label: "Livrare și retururi", icon: TruckIcon },
  { href: "/contact", label: "Contact", icon: PhoneIcon },
];

// Funcție helper pentru a obține iconul potrivit pentru fiecare categorie
function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  
  if (name.includes("birou")) {
    return BuildingOfficeIcon;
  }
  if (name.includes("auto")) {
    return BoltIcon; // Folosim BoltIcon pentru auto (reprezintă energie/putere)
  }
  if (name.includes("scule") || name.includes("unelte")) {
    return WrenchScrewdriverIcon;
  }
  
  // Icon default pentru restul categoriilor
  return TagIcon;
}

// Component intern care folosește useSearchParams
function SiteHeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const { categories, loading: loadingCategories } = useCategories();
  const { itemCount } = useCart();
  const { user, signOut, loading: authLoading } = useAuth();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/" && !searchParams?.get("categorie");
    }
    return pathname?.startsWith(href);
  };

  const isCategoryActive = (categoryName) => {
    return searchParams?.get("categorie") === categoryName;
  };

  const handleCategoryClick = () => {
    setOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8 xl:px-12">
        {/* Desktop layout */}
        <div className="hidden lg:flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white font-[family-name:var(--font-orbitron)] tracking-tight">
            creatinglayers.ro
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive(link.href) ? "text-emerald-300" : "hover:text-emerald-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {!authLoading && (
              <>
                {user ? (
                  <Menu as="div" className="relative">
                    <MenuButton className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300 hover:bg-white/10">
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="max-w-[120px] truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-zinc-200 bg-white shadow-xl focus:outline-none">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-zinc-100 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900">
                              {user.user_metadata?.full_name || "Utilizator"}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={signOut}
                            className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-1.5 text-zinc-700 transition hover:bg-zinc-200 flex-shrink-0"
                            aria-label="Ieșire"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href="/comenzi"
                              className={`block rounded-xl px-3 py-2 text-sm text-zinc-700 transition ${
                                focus ? "bg-emerald-50 text-emerald-600" : ""
                              }`}
                            >
                              Comenzile mele
                            </Link>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                ) : (
                  <Link
                    href="/autentificare"
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-300"
                  >
                    Intră în cont
                  </Link>
                )}
              </>
            )}
            <Link
              href="/cos"
              className="relative inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              aria-label="Coș de cumpărături"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-600">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <span className="hidden sm:inline">Coș</span>
            </Link>
          </div>
        </div>
        {/* Mobile layout: menu button (left) - logo (center) - cart button (right) */}
        <div className="relative flex lg:hidden items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Deschide meniul"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-white font-[family-name:var(--font-orbitron)] tracking-tight">
            creatinglayers.ro
          </Link>
          <Link
            href="/cos"
            className="relative inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Coș de cumpărături"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
    <>
      {/* Overlay pentru sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar din stânga */}
      <div
        className={`fixed top-0 left-0 z-[110] h-full w-80 max-w-[85vw] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header sidebar cu logo și buton închidere */}
          <div className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-5 bg-zinc-900/50">
            <Link 
              href="/" 
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-white font-[family-name:var(--font-orbitron)] tracking-tight"
            >
              creatinglayers.ro
            </Link>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={() => setOpen(false)}
              aria-label="Închide meniul"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Conținut sidebar - scrollable */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {/* Categorii de produse */}
              <div className="px-4 py-4">
                <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Categorii
                </p>
                <nav className="space-y-1">
                  <Link
                    href="/"
                    onClick={handleCategoryClick}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      !searchParams?.get("categorie")
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <HomeIcon className={`h-5 w-5 flex-shrink-0 ${
                      !searchParams?.get("categorie") ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
                    }`} />
                    Toate produsele
                  </Link>
                  <Link
                    href="/?categorie=personalizate"
                    onClick={handleCategoryClick}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isCategoryActive("personalizate")
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <SparklesIcon className={`h-5 w-5 flex-shrink-0 ${
                      isCategoryActive("personalizate") ? "text-purple-400" : "text-zinc-400 group-hover:text-zinc-300"
                    }`} />
                    Personalizate
                  </Link>
                  {loadingCategories ? (
                    <div className="px-3 py-2.5">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500"></div>
                    </div>
                  ) : (
                    categories.map((category) => {
                      const CategoryIcon = getCategoryIcon(category.nume);
                      return (
                        <Link
                          key={category.id}
                          href={`/?categorie=${encodeURIComponent(category.nume)}`}
                          onClick={handleCategoryClick}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isCategoryActive(category.nume)
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <CategoryIcon className={`h-5 w-5 flex-shrink-0 ${
                            isCategoryActive(category.nume) ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
                          }`} />
                          {category.nume}
                        </Link>
                      );
                    })
                  )}
                </nav>
              </div>

              {/* Navigare principală */}
              <div className="px-4 py-4 border-t border-zinc-800/50">
                <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Navigare
                </p>
                <nav className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive(link.href)
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive(link.href) ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
                        }`} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Link către coș */}
              <div className="px-4 py-4 border-t border-zinc-800/50">
                <Link
                  href="/cos"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCartIcon className="h-5 w-5 text-zinc-400 group-hover:text-zinc-300" />
                    <span>Coș de cumpărături</span>
                  </div>
                  {itemCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Secțiunea de cont utilizator jos - fixă */}
            {!authLoading && (
              <div className="border-t border-zinc-800/50 bg-zinc-900/30 px-4 py-4">
                {user ? (
                  <>
                    <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-zinc-800/50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-emerald-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {user.user_metadata?.full_name || "Utilizator"}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setOpen(false);
                        }}
                        className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20 flex-shrink-0"
                        aria-label="Ieșire"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <Link
                      href="/comenzi"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <InformationCircleIcon className="h-5 w-5 text-zinc-400" />
                      Comenzile mele
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/autentificare"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Intră în cont
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    </>
  );
}

// Component wrapper cu Suspense pentru useSearchParams
export default function SiteHeader() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-white font-[family-name:var(--font-orbitron)] tracking-tight">
              creatinglayers.ro
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>
      </header>
    }>
      <SiteHeaderContent />
    </Suspense>
  );
}

