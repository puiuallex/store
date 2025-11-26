"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ColorSelectionModal({ isOpen, onClose, colors, onSelect, productName }) {
  if (!colors || colors.length === 0) {
    // Dacă nu are culori, adaugă direct
    if (isOpen) {
      onSelect(null);
      onClose();
    }
    return null;
  }

  if (colors.length === 1) {
    // Dacă are o singură culoare, adaugă direct
    if (isOpen) {
      onSelect(colors[0]);
      onClose();
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-2xl font-semibold text-zinc-900">
              Selectează culoarea
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
              aria-label="Închide"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-600">
              Selectează culoarea pentru <span className="font-semibold text-zinc-900">{productName}</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(color);
                    onClose();
                  }}
                  className="rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

