"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/app/actions/orders";

export default function OrderDetailsPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
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
      setLoading(true);
      setError(null);

      try {
        const result = await getOrderById(orderId, user?.id || null);

        if (result.error) {
          setError(result.error);
          setOrder(null);
        } else {
          setOrder(result.data);
        }
      } catch (err) {
        console.error("Eroare:", err);
        setError("A apărut o eroare la încărcarea comenzii.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user]);

  if (loading || authLoading || !orderId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Detalii comandă</h1>
        <p className="text-zinc-600">Se încarcă...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-900">Detalii comandă</h1>
        </header>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-lg font-semibold text-rose-800">{error}</p>
          <Link
            href="/comenzi"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Înapoi la comenzi
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "nouă":
        return "bg-amber-100 text-amber-800";
      case "confirmată":
        return "bg-blue-100 text-blue-800";
      case "expediată":
        return "bg-emerald-100 text-emerald-800";
      case "livrată":
        return "bg-green-100 text-green-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Detalii comandă</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Comandă #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <Link
            href="/comenzi"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            ← Înapoi la comenzi
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informații despre comandă */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Status comandă</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Status:</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Data plasării:</span>
                <span className="text-sm font-medium text-zinc-900">
                  {new Date(order.created_at).toLocaleDateString("ro-RO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Metodă de plată:</span>
                <span className="text-sm font-medium text-zinc-900">
                  {order.payment_method === "ramburs" ? "Ramburs" : "Card"}
                </span>
              </div>
            </div>
          </div>

          {/* Adresă de livrare */}
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Adresă de livrare</h2>
            <div className="space-y-2 text-sm text-zinc-600">
              <p className="font-medium text-zinc-900">{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.county}
              </p>
              <p>Cod poștal: {order.shipping_address.postalCode}</p>
            </div>
          </div>

          {/* Observații */}
          {order.notes && (
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">Observații</h2>
              <p className="text-sm text-zinc-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Produse și total */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Produse comandate</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{item.product_name}</p>
                    <p className="text-sm text-zinc-600">
                      Cantitate: {item.quantity} × {item.price.toFixed(2)} lei
                    </p>
                  </div>
                  <p className="font-semibold text-zinc-900">
                    {(item.quantity * item.price).toFixed(2)} lei
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Rezumat comandă</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span>{order.subtotal.toFixed(2)} lei</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Livrare:</span>
                <span>
                  {order.total > order.subtotal
                    ? `${(order.total - order.subtotal).toFixed(2)} lei`
                    : "Calcul la confirmare"}
                </span>
              </div>
              <div className="border-t border-zinc-100 pt-3">
                <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
                  <span>Total:</span>
                  <span>
                    {order.total ? `${order.total.toFixed(2)} lei` : "Calcul la confirmare"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            <p className="font-semibold mb-1">Următorii pași:</p>
            <p>
              {order.status === "nouă"
                ? "Comanda ta a fost primită. Vom confirma telefonic înainte de expediere."
                : order.status === "confirmată"
                  ? "Comanda ta a fost confirmată. Vom proceda la expediere în curând."
                  : order.status === "expediată"
                    ? "Comanda ta a fost expediată. Vei primi un telefon când ajunge la tine."
                    : "Comanda ta a fost livrată. Mulțumim pentru comandă!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


