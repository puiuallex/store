"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/app/actions/orders";
import { useAuth } from "@/context/AuthContext";

export default function OrderSuccessPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    async function loadOrderId() {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    }
    loadOrderId();
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const result = await getOrderById(orderId, user?.id || null);

        if (result.error) {
          // Dacă nu găsește comanda, redirect către acasă
          router.push("/");
          return;
        }

        setOrder(result.data);
      } catch (err) {
        console.error("Eroare:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-zinc-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Mesaj de success */}
      <div className="text-center mb-4 lg:mb-6">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-12 w-12 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-zinc-900 lg:text-4xl">Mulțumim pentru comandă!</h1>
        <p className="mt-3 text-lg text-zinc-600">
          Comanda ta a fost plasată cu succes și a fost primită.
        </p>
      </div>

      {/* Card cu informații despre comandă */}
      <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Detalii comandă</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Număr comandă: <span className="font-mono font-semibold text-zinc-900">#{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>

          <div className="grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-700">Status</h3>
              <p className="mt-1 text-sm text-zinc-600">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {order.status}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-700">Total</h3>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {order.total ? `${order.total.toFixed(2)} lei` : `${order.subtotal.toFixed(2)} lei`}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-6">
            <h3 className="text-sm font-semibold text-zinc-700">Livrare la</h3>
            <p className="mt-2 text-sm text-zinc-600">
              {order.shipping_address.fullName}
              <br />
              {order.shipping_address.address}
              <br />
              {order.shipping_address.city}, {order.shipping_address.county}
              <br />
              Cod poștal: {order.shipping_address.postalCode}
              <br />
              Telefon: {order.shipping_address.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Informații importante */}
      <div className="mt-6 lg:mt-8 rounded-2xl bg-blue-50 border border-blue-200 p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Ce urmează?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">✓</span>
            <span>Vom confirma comanda ta telefonic înainte de expediere</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">✓</span>
            <span>Plata se face la livrare (ramburs)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">✓</span>
            <span>Vei primi un telefon când coletul ajunge la tine</span>
          </li>
        </ul>
      </div>

      {/* Acțiuni */}
      <div className="mt-6 lg:mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href={`/comenzi/${order.id}`}
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Vezi detalii comandă
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
        >
          Continuă cumpărăturile
        </Link>
      </div>

      {user && (
        <div className="mt-6 text-center">
          <Link
            href="/comenzi"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            Vezi toate comenzile mele →
          </Link>
        </div>
      )}
    </div>
  );
}




