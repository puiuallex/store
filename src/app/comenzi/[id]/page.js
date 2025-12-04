"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/app/actions/orders";
import { getProductById } from "@/app/actions/products";

export default function OrderDetailsPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [productImages, setProductImages] = useState({});

  // Funcție helper pentru a extrage numele culorii
  const getColorName = (color) => {
    if (!color) return null;
    if (typeof color === "string") return color;
    if (typeof color === "object" && color.nume) return color.nume;
    return null;
  };

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
          
          // Obține imaginile produselor - folosește product_image din items dacă există, altfel fetch din product_id
          if (result.data?.items) {
            const images = {};
            await Promise.all(
              result.data.items.map(async (item) => {
                if (item.product_id) {
                  // Verifică mai întâi dacă există product_image în item (pentru comenzile noi)
                  if (item.product_image) {
                    images[item.product_id] = item.product_image;
                  } else {
                    // Pentru comenzile vechi, fetch din product_id
                    try {
                      const productResult = await getProductById(item.product_id);
                      if (productResult.data && !productResult.error) {
                        // Verifică mai întâi imagini (array), apoi imagine (string)
                        let imageUrl = null;
                        if (productResult.data.imagini && Array.isArray(productResult.data.imagini) && productResult.data.imagini.length > 0) {
                          imageUrl = productResult.data.imagini[0];
                        } else if (productResult.data.imagine) {
                          imageUrl = productResult.data.imagine;
                        }
                        if (imageUrl) {
                          images[item.product_id] = imageUrl;
                        }
                      }
                    } catch (err) {
                      console.error(`Eroare la obținerea imaginii pentru produs ${item.product_id}:`, err);
                    }
                  }
                }
              })
            );
            setProductImages(images);
          }
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
    <div>
      <header className="space-y-2 mb-4 lg:mb-6">
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
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Produse comandate</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => {
                const productImage = item.product_id ? productImages[item.product_id] : null;
                const hasImage = productImage && productImage.trim() !== "";
                return (
                  <div
                    key={index}
                    className="group rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-md"
                  >
                    {/* Layout mobil: vertical, desktop: orizontal */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Imagine produs */}
                      {item.product_id ? (
                        <Link 
                          href={`/produse/${item.product_id}`}
                          className="relative aspect-square w-full sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 transition-transform group-hover:scale-[1.02]"
                        >
                          {hasImage ? (
                            <Image
                              src={productImage}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 96px"
                              onError={(e) => {
                                console.error("Eroare la încărcarea imaginii:", productImage);
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div className="relative aspect-square w-full sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Conținut */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Titlu produs */}
                          {item.product_id ? (
                            <Link 
                              href={`/produse/${item.product_id}`}
                              className="block group/title mb-2"
                            >
                              <h3 className="text-base font-semibold text-zinc-900 group-hover/title:text-emerald-600 transition line-clamp-2">
                                {item.product_name}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="text-base font-semibold text-zinc-900 mb-2 line-clamp-2">
                              {item.product_name}
                            </h3>
                          )}
                          
                          {/* Detalii produs */}
                          <div className="space-y-1.5 text-sm text-zinc-600">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-zinc-400">Cantitate:</span>
                              <span className="font-medium text-zinc-900">{item.quantity}</span>
                              <span className="text-zinc-400">×</span>
                              <span className="font-medium text-zinc-900">{item.price.toFixed(2)} lei</span>
                            </div>
                            {item.color && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-zinc-400">Culoare:</span>
                                <span className="font-medium text-zinc-900">{getColorName(item.color)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Preț total */}
                        <div className="flex-shrink-0 sm:text-right">
                          <p className="text-lg font-bold text-zinc-900">
                            {(item.quantity * item.price).toFixed(2)} lei
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  {order.total > order.subtotal ? (
                    (order.total - order.subtotal) === 0 ? (
                      <span className="text-emerald-600 font-semibold">Gratuit</span>
                    ) : (
                      `${(order.total - order.subtotal).toFixed(2)} lei`
                    )
                  ) : (
                    "Gratuit"
                  )}
                </span>
              </div>
              <div className="border-t border-zinc-100 pt-3">
                <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
                  <span>Total:</span>
                  <span>{order.total ? `${order.total.toFixed(2)} lei` : `${order.subtotal.toFixed(2)} lei`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            <p className="font-semibold mb-1">Următorii pași:</p>
            <p>
              {order.status === "nouă"
                ? "Comanda ta a fost primită."
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




