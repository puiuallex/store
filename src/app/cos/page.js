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
        <h1 className="text-3xl font-semibold text-zinc-900">Coșul tău este gol</h1>
        <p className="text-zinc-600">Adaugă produse din catalog pentru a continua comanda.</p>
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
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-zinc-900">Coș de cumpărături</h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-rose-600 hover:text-rose-500"
          >
            Golește coșul
          </button>
        </div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-3xl border border-zinc-200 bg-white p-4">
              <Link href={`/produse/${item.id}`} className="relative h-32 w-32 overflow-hidden rounded-2xl bg-zinc-100 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/produse/${item.id}`} className="text-lg font-semibold text-zinc-900 hover:text-emerald-600 transition">
                      {item.name}
                    </Link>
                    <p className="text-sm text-zinc-500">Preț unitar: {item.price} lei</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-semibold text-rose-600 hover:text-rose-500"
                    aria-label="Elimină produs"
                  >
                    Elimină
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityInput value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} />
                  <p className="text-lg font-semibold text-zinc-900">
                    {(item.price * item.quantity).toFixed(2)} lei
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-semibold text-zinc-900">Rezumat comandă</h2>
        <div className="mt-6 space-y-3 text-sm text-zinc-600">
          <div className="flex items-center justify-between">
            <span>Produse ({itemCount})</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Livrare estimată</span>
            <span>Calcul la confirmare</span>
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
            <span>Total estimativ</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
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
    <div className="inline-flex items-center rounded-full border border-zinc-200">
      <button
        type="button"
        onClick={() => handleChange(-1)}
        className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
      >
        -
      </button>
      <span className="px-4 text-sm font-medium text-zinc-900">{value}</span>
      <button
        type="button"
        onClick={() => handleChange(1)}
        className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
      >
        +
      </button>
    </div>
  );
}

