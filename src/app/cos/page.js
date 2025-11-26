"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Calcul cost livrare: 20 lei dacă subtotal <= 100, altfel gratuit
  const shippingCost = subtotal <= 100 ? 20 : 0;
  const total = subtotal + shippingCost;

  const handleClearCart = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setIsConfirmModalOpen(false);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">Coșul tău este gol</h1>
        <p className="text-sm text-zinc-600 sm:text-base">Adaugă produse din catalog pentru a continua comanda.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Vezi produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-10">
      {/* Lista produselor */}
      <div className="order-1 space-y-6 lg:order-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">Coș de cumpărături</h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-sm font-semibold text-rose-600 hover:text-rose-500 sm:self-center transition"
            >
              Golește coșul
            </button>
          )}
        </div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 shadow-sm transition hover:shadow-md hover:border-zinc-300">
              <div className="flex gap-3 p-4 sm:gap-6 sm:p-6">
                {/* Imagine */}
                <Link 
                  href={`/produse/${item.id}`} 
                  className="relative aspect-square w-16 h-16 overflow-hidden rounded-xl bg-zinc-100 flex-shrink-0 sm:w-32 sm:h-32 transition-transform group-hover:scale-[1.02]"
                >
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 640px) 64px, 128px" 
                  />
                </Link>

                {/* Conținut */}
                <div className="flex flex-1 flex-col gap-3 min-w-0 sm:gap-4">
                  {/* Header cu nume și buton elimină */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/produse/${item.id}`} 
                        className="text-base font-semibold text-zinc-900 hover:text-emerald-600 transition line-clamp-3 sm:text-xl"
                      >
                        {item.name}
                      </Link>
                      {item.color && (
                        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                          Culoare: <span className="font-medium">{item.color}</span>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.color)}
                      className="flex-shrink-0 rounded-full p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition sm:p-2"
                      aria-label="Elimină produs"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer cu cantitate și preț total - pe rând nou pe desktop */}
              <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-4 border-t border-zinc-100 sm:px-6 sm:pb-6 sm:pt-6">
                <QuantityInput value={item.quantity} onChange={(value) => updateQuantity(item.id, value, item.color)} />
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900 sm:text-xl">
                    {(item.price * item.quantity).toFixed(2)} lei
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de confirmare */}
      <Dialog open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-semibold text-zinc-900">
                Golește coșul
              </DialogTitle>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                aria-label="Închide"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-zinc-600">
                Ești sigur că vrei să golești coșul?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                >
                  Anulează
                </button>
                <button
                  onClick={confirmClearCart}
                  className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  Golește coșul
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Rezumat comandă - deasupra pe mobil, sidebar pe desktop */}
      <aside className="order-2 lg:order-2 rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-lg font-semibold text-zinc-900 lg:text-xl">Rezumat comandă</h2>
        <div className="mt-4 space-y-3 text-sm text-zinc-600 lg:mt-6">
          <div className="flex items-center justify-between">
            <span>Produse ({itemCount})</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Livrare</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600 font-semibold">Gratuit</span>
              ) : (
                `${shippingCost.toFixed(2)} lei`
              )}
            </span>
          </div>
          {subtotal < 100 && (
            <div className="text-xs text-emerald-600">
              Mai adaugă produse în valoare de {((100 - subtotal).toFixed(2))} lei și primești livrare gratuită
            </div>
          )}
        </div>
        <div className="mt-4 border-t border-zinc-100 pt-4 lg:mt-6">
          <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
            <span>Total</span>
            <span>{total.toFixed(2)} lei</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 lg:mt-6"
        >
          Continuă către checkout
        </Link>
        {!user && (
          <p className="mt-2 text-center text-xs text-zinc-500">
            Poți plasa comenzi fără cont. Dacă ai cont,{" "}
            <Link href="/autentificare" className="font-semibold text-emerald-600 hover:text-emerald-500">
              autentifică-te
            </Link>{" "}
            pentru a urmări comenzile tale.
          </p>
        )}
        <p className="mt-4 text-xs text-zinc-500">
          Plata se face exclusiv la livrare (ramburs). Confirmăm telefonic înainte de expediere.
        </p>
      </aside>
    </div>
  );
}

function QuantityInput({ value, onChange }) {
  const handleChange = (delta) => {
    const newValue = value + delta;
    if (newValue < 1) return;
    onChange(newValue);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
      <button
        type="button"
        onClick={() => handleChange(-1)}
        className="px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition rounded-l-lg"
        aria-label="Scade cantitatea"
      >
        -
      </button>
      <span className="min-w-[2.5rem] px-3 py-1.5 text-center text-sm font-semibold text-zinc-900 bg-white">{value}</span>
      <button
        type="button"
        onClick={() => handleChange(1)}
        className="px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition rounded-r-lg"
        aria-label="Crește cantitatea"
      >
        +
      </button>
    </div>
  );
}

