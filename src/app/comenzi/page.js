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
    <div>
      <header className="space-y-2 mb-4 lg:mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Comenzile mele</h1>
        <p className="text-zinc-600">Vezi toate comenzile tale și statusul lor.</p>
      </header>

      {showSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Comanda ta a fost plasată cu succes!
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
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/comenzi/${order.id}`}
              className="block rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white/80 p-4 sm:p-6 shadow-sm sm:shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:border-emerald-300 hover:shadow-md sm:hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)]"
            >
              {/* Layout mobil: vertical, desktop: orizontal */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div className="flex-1 space-y-2 min-w-0">
                  {/* Header cu număr comandă și status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <p className="text-base sm:text-lg font-semibold text-zinc-900">
                      Comandă #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500">Status:</span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold w-fit ${
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
                  </div>
                  
                  {/* Data */}
                  <p className="text-sm text-zinc-600">
                    Plasată pe {new Date(order.created_at).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  
                  {/* Observații */}
                  {order.notes && (
                    <p className="text-sm text-zinc-500 line-clamp-2">Observații: {order.notes}</p>
                  )}
                </div>
                
                {/* Preț și detalii - pe mobil jos, pe desktop dreapta */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="sm:space-y-1">
                    <p className="text-lg font-bold text-zinc-900">
                      {order.total ? `${order.total.toFixed(2)} lei` : "Calcul la confirmare"}
                    </p>
                    <p className="text-xs text-zinc-500 hidden sm:block">
                      {order.payment_method === "ramburs" ? "Plată ramburs" : "Plată cu cardul"}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 sm:mt-2">
                    Detalii →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

