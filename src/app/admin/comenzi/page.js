"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllOrders, updateOrderStatus } from "@/app/actions/admin";
import { checkAdminAccess } from "@/app/actions/admin";

const ORDER_STATUSES = ["nouă", "confirmată", "expediată", "livrată", "anulată"];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
        const adminCheck = await checkAdminAccess(user.id);
        setIsAdmin(adminCheck.isAdmin);

        if (!adminCheck.isAdmin) {
          router.push("/");
          return;
        }

        const result = await getAllOrders(user.id);
        if (result.data) {
          setOrders(result.data);
        }
        setLoading(false);
      } else if (!authLoading && !user) {
        router.push("/autentificare");
      }
    }

    loadData();
  }, [user, authLoading, router]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus, user?.id || null);

    if (result.error) {
      alert(result.error);
    } else {
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    }
  };

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
      case "anulată":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="text-zinc-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Gestionare comenzi</h1>
          <p className="mt-1 text-sm text-zinc-600">Gestionează comenzile clienților</p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Comandă
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                    Nu există comenzi.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-semibold text-zinc-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.items?.length || 0} produse
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-900">
                        {order.shipping_address?.fullName || "Guest"}
                      </p>
                      <p className="text-xs text-zinc-500">{order.shipping_address?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {new Date(order.created_at).toLocaleDateString("ro-RO")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                      {order.total ? `${order.total} lei` : `${order.subtotal} lei`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Link
                          href={`/comenzi/${order.id}`}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          Vezi
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Link
        href="/admin"
        className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500"
      >
        ← Înapoi la panou
      </Link>
    </div>
  );
}



