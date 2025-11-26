"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/app/actions/orders";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcul cost livrare: 20 lei dacă subtotal <= 100, altfel gratuit
  const shippingCost = subtotal <= 100 ? 20 : 0;
  const total = subtotal + shippingCost;

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
    notes: "",
  });

  // Redirect dacă coșul e gol
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cos");
    }
  }, [items.length, router]);

  // Dacă coșul e gol, nu renderiza conținutul
  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_address: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          county: formData.county,
          postalCode: formData.postalCode,
        },
        notes: formData.notes,
      };

      // Trimite userId dacă utilizatorul este autentificat
      const result = await createOrder(orderData, user?.id || null);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.data && result.data.id) {
        clearCart();
        // Redirect către pagina de success folosind window.location pentru a fi siguri că funcționează
        const orderId = result.data.id;
        console.log("Redirecting to success page with order ID:", orderId);
        
        // Folosim window.location.href pentru un redirect sigur
        window.location.href = `/comenzi/success/${orderId}`;
        } else {
        console.error("Order creation result:", result);
        setError("Comanda a fost creată, dar nu am putut obține ID-ul comenzii. Te rugăm să verifici comenzile tale.");
        setLoading(false);
      }
    } catch (err) {
      setError("A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-900">Finalizează comanda</h1>
          <p className="text-zinc-600">Completează datele pentru livrare.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">Date de livrare</h2>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Nume complet *
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Nume Prenume"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Telefon *
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="07XX XXX XXX"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Adresă *
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Strada, număr, bloc, scară, apartament"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Oraș *
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  placeholder="București"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Județ *
                <input
                  type="text"
                  name="county"
                  required
                  value={formData.county}
                  onChange={handleChange}
                  className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  placeholder="București"
                />
              </label>
            </div>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Cod poștal *
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="123456"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Observații (opțional)
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white resize-none"
                placeholder="Instrucțiuni speciale pentru livrare..."
              />
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Plasez comanda..." : "Plasează comanda"}
            </button>
          </div>
        </form>
      </div>

      <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] h-fit">
        <h2 className="text-xl font-semibold text-zinc-900">Rezumat comandă</h2>
        <div className="mt-6 space-y-3 text-sm text-zinc-600">
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
        <div className="mt-6 border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
            <span>Total</span>
            <span>{total.toFixed(2)} lei</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Plata se face exclusiv la livrare (ramburs). Vom confirma telefonic înainte de expediere.
        </p>
        <Link href="/cos" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-500">
          ← Înapoi la coș
        </Link>
      </aside>
    </div>
  );
}

