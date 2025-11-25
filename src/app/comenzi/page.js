"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        setShowSuccess(true);
        window.history.replaceState({}, "", "/comenzi");
        setTimeout(() => setShowSuccess(false), 5000);
      }
    }

    if (!authLoading && !user) {
      router.push("/autentificare");
      return;
    }

    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Eroare la încărcarea comenzilor:", error);
          setOrders([]);
        } else {
          setOrders(data || []);
        }
      } catch (error) {
        console.error("Eroare:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, supabase, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Comenzile mele</h1>
        <p className="text-zinc-600">Se încarcă...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Comenzile mele</h1>
        <p className="text-zinc-600">Vezi toate comenzile tale și statusul lor.</p>
      </header>

      {showSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Comanda ta a fost plasată cu succes! Vom confirma telefonic înainte de expediere.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center">
          <p className="text-lg font-semibold text-zinc-900">Nu ai comenzi încă</p>
          <p className="mt-2 text-sm text-zinc-600">
            Când plasezi o comandă, o vei vedea aici.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Vezi produsele
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/comenzi/${order.id}`}
              className="block rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:border-emerald-300 hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-zinc-900">
                      Comandă #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "nouă"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "confirmată"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "expediată"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600">
                    Plasată pe {new Date(order.created_at).toLocaleDateString("ro-RO")}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-zinc-500">Observații: {order.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-zinc-900">
                    {order.total ? `${order.total} lei` : "Calcul la confirmare"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {order.payment_method === "ramburs" ? "Plată ramburs" : "Plată cu cardul"}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-emerald-600">Vezi detalii →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

