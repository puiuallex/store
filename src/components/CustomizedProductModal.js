"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CustomizedProductModal({ isOpen, onClose, productName }) {
  const phoneNumber = "40786089834"; // +40 786 089 834 fără spații și +
  const message = encodeURIComponent(
    `Bună! Aș dori să comand un produs personalizat: ${productName}. Te rog să îmi spui mai multe detalii despre opțiunile de personalizare disponibile.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-2xl font-semibold text-zinc-900">
              Produs personalizat
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
              aria-label="Închide"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-zinc-600">
              Acest produs poate fi personalizat conform preferințelor tale. Pentru a comanda, te
              rugăm să ne contactezi pe WhatsApp pentru a discuta detaliile personalizării.
            </p>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm font-medium text-emerald-900 mb-2">
                Produs: <span className="font-semibold">{productName}</span>
              </p>
              <p className="text-xs text-emerald-700">
                Vom discuta împreună opțiunile de personalizare disponibile și prețul final.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full rounded-full bg-[#25D366] px-6 py-4 text-white font-semibold shadow-lg transition hover:bg-[#20BA5A] hover:shadow-xl"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  fill="currentColor"
                />
              </svg>
              <span>Comandă pe WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              Anulează
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}






