"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllOrders, updateOrderStatus } from "@/app/actions/admin";
import { useToast } from "@/context/ToastContext";

const ORDER_STATUSES = ["nouă", "confirmată", "expediată", "livrată", "anulată"];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_address?.phone?.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus, user?.id || null);

    if (result.error) {
      showToast(result.error, "error");
    } else {
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
      showToast(`Statusul comenzii a fost actualizat la "${newStatus}".`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Comenzi</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {filteredOrders.length} {filteredOrders.length === 1 ? "comandă" : "comenzi"}
          </p>
        </div>
      </div>

      {/* Filtre și căutare */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Caută după ID comandă, nume client sau telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-zinc-300 rounded-lg bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Toate statusurile</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel comenzi */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Comandă
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                    {searchQuery || statusFilter !== "all" ? (
                      "Nu s-au găsit comenzi care să corespundă filtrelor."
                    ) : (
                      "Nu există comenzi."
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition">
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
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
    </div>
  );
}
