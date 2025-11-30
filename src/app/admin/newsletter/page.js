"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllNewsletterSubscribers } from "@/app/actions/newsletter";
import { useToast } from "@/context/ToastContext";

export default function AdminNewsletterPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!authLoading && user) {
        const result = await getAllNewsletterSubscribers(user.id);
        if (result.data) {
          setSubscribers(result.data);
        } else if (result.error) {
          showToast(result.error, "error");
        }
        setLoading(false);
      } else if (!authLoading && !user) {
        router.push("/autentificare");
      }
    }

    loadData();
  }, [user, authLoading, router, showToast]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subscribers, searchQuery]);

  const handleExportCSV = () => {
    const csvContent = [
      ["Email", "Status", "Data abonării"],
      ...filteredSubscribers.map((s) => [
        s.email,
        s.status,
        new Date(s.created_at).toLocaleDateString("ro-RO"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Lista a fost exportată cu succes.");
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

  const activeSubscribers = subscribers.filter((s) => s.status === "active").length;
  const unsubscribed = subscribers.filter((s) => s.status === "unsubscribed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Newsletter</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {filteredSubscribers.length} {filteredSubscribers.length === 1 ? "abonat" : "abonați"}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Statistici */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-600">Total abonați</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900">{subscribers.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-600">Abonați activi</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{activeSubscribers}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-600">Dezabonați</p>
          <p className="mt-2 text-2xl font-bold text-zinc-600">{unsubscribed}</p>
        </div>
      </div>

      {/* Căutare */}
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Caută după email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabel abonați */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Data abonării
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-zinc-500">
                    {searchQuery ? (
                      "Nu s-au găsit abonați care să corespundă căutării."
                    ) : (
                      "Nu există abonați la newsletter."
                    )}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-zinc-50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-900">{subscriber.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          subscriber.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {subscriber.status === "active" ? "Activ" : "Dezabonat"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {new Date(subscriber.created_at).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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




