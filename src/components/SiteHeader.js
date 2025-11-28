"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, UserCircleIcon, ChevronDownIcon, ShoppingCartIcon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Produse" },
  { href: "/livrare", label: "Livrare și retururi" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut, loading: authLoading } = useAuth();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
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
        className={`fixed top-0 left-0 z-[110] h-full w-80 max-w-[85vw] bg-zinc-950/80 backdrop-blur shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header sidebar cu buton închidere */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Meniu</h2>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={() => setOpen(false)}
              aria-label="Închide meniul"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Conținut sidebar */}
          <div className="flex flex-col h-full overflow-hidden">
            <nav className="flex flex-col gap-4 px-6 py-6 text-sm font-medium text-white overflow-y-auto flex-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 transition ${
                    isActive(link.href) ? "text-emerald-300" : "hover:text-emerald-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Secțiunea de cont utilizator jos */}
            {!authLoading && (
              <div className="border-t border-zinc-800 px-6 py-4">
                {user ? (
                  <>
                    <div className="flex items-start justify-between gap-3 pb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {user.user_metadata?.full_name || "Utilizator"}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setOpen(false);
                        }}
                        className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 flex-shrink-0"
                        aria-label="Ieșire"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <Link
                      href="/comenzi"
                      className="block py-2 text-sm font-medium text-white transition hover:text-emerald-300"
                      onClick={() => setOpen(false)}
                    >
                      Comenzile mele
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/autentificare"
                    className="block w-full rounded-full border border-white/20 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-300"
                    onClick={() => setOpen(false)}
                  >
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

