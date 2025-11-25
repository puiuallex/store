"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

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
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10">
      {/* Rezumat comandă - deasupra pe mobil, sidebar pe desktop */}
      <aside className="order-2 lg:order-1 rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-lg font-semibold text-zinc-900 lg:text-xl">Rezumat comandă</h2>
        <div className="mt-4 space-y-3 text-sm text-zinc-600 lg:mt-6">
          <div className="flex items-center justify-between">
            <span>Produse ({itemCount})</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Livrare estimată</span>
            <span>Calcul la confirmare</span>
          </div>
        </div>
        <div className="mt-4 border-t border-zinc-100 pt-4 lg:mt-6">
          <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
            <span>Total estimativ</span>
            <span>{subtotal.toFixed(2)} lei</span>
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

      {/* Lista produselor */}
      <div className="order-1 space-y-4 lg:order-2 lg:space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">Coș de cumpărături</h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-rose-600 hover:text-rose-500 sm:self-center"
          >
            Golește coșul
          </button>
        </div>
        <ul className="space-y-3 lg:space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:flex-row sm:gap-4 sm:rounded-3xl sm:p-4">
              <Link href={`/produse/${item.id}`} className="relative h-24 w-full overflow-hidden rounded-xl bg-zinc-100 flex-shrink-0 sm:h-32 sm:w-32">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 128px" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link href={`/produse/${item.id}`} className="text-base font-semibold text-zinc-900 hover:text-emerald-600 transition sm:text-lg line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">Preț unitar: {item.price} lei</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-500 flex-shrink-0 sm:text-sm"
                    aria-label="Elimină produs"
                  >
                    Elimină
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <QuantityInput value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} />
                  <p className="text-base font-semibold text-zinc-900 sm:text-lg">
                    {(item.price * item.quantity).toFixed(2)} lei
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
    <div className="inline-flex items-center rounded-full border border-zinc-200">
      <button
        type="button"
        onClick={() => handleChange(-1)}
        className="px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 active:bg-zinc-100 sm:px-4 sm:py-2"
        aria-label="Scade cantitatea"
      >
        -
      </button>
      <span className="min-w-[2rem] px-3 text-center text-sm font-medium text-zinc-900 sm:px-4">{value}</span>
      <button
        type="button"
        onClick={() => handleChange(1)}
        className="px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 active:bg-zinc-100 sm:px-4 sm:py-2"
        aria-label="Crește cantitatea"
      >
        +
      </button>
    </div>
  );
}

