"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre" },
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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-white">
          Creating Layers
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-200 lg:flex">
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
        <div className="hidden items-center gap-3 lg:flex">
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
                      <div className="px-3 py-2 border-b border-zinc-100">
                        <p className="text-sm font-semibold text-zinc-900">
                          {user.user_metadata?.full_name || "Utilizator"}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
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
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={signOut}
                            className={`w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-700 transition ${
                              focus ? "bg-rose-50 text-rose-600" : ""
                            }`}
                          >
                            Ieșire
                          </button>
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
                  Cont
                </Link>
              )}
            </>
          )}
          <Link
            href="/cos"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Coș ({itemCount})
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-full bg-white/10 p-2 text-white lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Deschide meniul"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-900/95 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-white">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/cos"
              className="rounded-full bg-emerald-500 px-4 py-2 text-center font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Coș ({itemCount})
            </Link>
            {!authLoading && (
              <>
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-zinc-700">
                      <p className="text-sm font-semibold text-white">
                        {user.user_metadata?.full_name || "Utilizator"}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/comenzi"
                      className="px-4 py-2 text-sm font-medium text-white"
                      onClick={() => setOpen(false)}
                    >
                      Comenzile mele
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="rounded-full border border-white/20 px-4 py-2 text-center font-semibold text-white"
                    >
                      Ieșire
                    </button>
                  </>
                ) : (
                  <Link
                    href="/autentificare"
                    className="rounded-full border border-white/20 px-4 py-2 text-center font-semibold text-white"
                    onClick={() => setOpen(false)}
                  >
                    Cont
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

