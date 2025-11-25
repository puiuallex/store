"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function AddToCartButton({ produs, size = "md" }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleClick = () => {
    addItem(produs, 1);
    showToast(`${produs.nume} a fost adăugat în coș`);
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${sizes[size]} bg-emerald-600 hover:bg-emerald-500`}
    >
      Adaugă în coș
    </button>
  );
}

