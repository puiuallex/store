"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import CustomizedProductModal from "@/components/CustomizedProductModal";
import ColorSelectionModal from "@/components/ColorSelectionModal";

export default function AddToCartButton({ produs, size = "md", selectedColor = null, disabled = false }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  // Funcție helper pentru a extrage numele culorii
  const getColorName = (color) => {
    if (!color) return null;
    if (typeof color === "string") return color;
    if (typeof color === "object" && color.nume) return color.nume;
    return null;
  };

  const handleClick = () => {
    // Dacă butonul este dezactivat, nu face nimic
    if (disabled) {
      return;
    }

    // Dacă produsul este personalizat, deschide modalul
    if (produs.personalizat) {
      setIsModalOpen(true);
      return;
    }

    // Dacă selectedColor este pasat ca prop și nu e null, folosește-l direct
    if (selectedColor !== null && selectedColor !== undefined && selectedColor !== "") {
      const colorName = getColorName(selectedColor);
      addItem(produs, 1, colorName);
      showToast(
        `${produs.nume}${colorName ? ` (${colorName})` : ""} a fost adăugat în coș`,
        "success",
        [
          {
            label: "Vezi coș",
            onClick: () => router.push("/cos"),
            primary: false,
          },
          {
            label: "Finalizează",
            onClick: () => router.push("/checkout"),
            primary: true,
          },
        ]
      );
      return;
    }

    // Dacă produsul are culori și nu e selectată culoarea, deschide modalul
    if (produs.culori && produs.culori.length > 1) {
      setIsColorModalOpen(true);
      return;
    }

    // Altfel, adaugă în coș normal (fără culoare sau cu culoarea unică)
    const color = produs.culori && produs.culori.length === 1 ? getColorName(produs.culori[0]) : null;
    addItem(produs, 1, color);
    showToast(
      `${produs.nume} a fost adăugat în coș`,
      "success",
      [
        {
          label: "Vezi coș",
          onClick: () => router.push("/cos"),
          primary: false,
        },
        {
          label: "Finalizează",
          onClick: () => router.push("/checkout"),
          primary: true,
        },
      ]
    );
  };

  const handleColorSelect = (color) => {
    const colorName = getColorName(color);
    addItem(produs, 1, colorName);
    showToast(
      `${produs.nume}${colorName ? ` (${colorName})` : ""} a fost adăugat în coș`,
      "success",
      [
        {
          label: "Vezi coș",
          onClick: () => router.push("/cos"),
          primary: false,
        },
        {
          label: "Finalizează",
          onClick: () => router.push("/checkout"),
          primary: true,
        },
      ]
    );
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 w-full lg:w-auto whitespace-nowrap";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`${baseClasses} ${sizes[size]} ${
          disabled
            ? "bg-zinc-300 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-500"
        }`}
      >
        {produs.personalizat ? "Comandă" : "Adaugă în coș"}
      </button>
      <CustomizedProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={produs.nume}
      />
      <ColorSelectionModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        colors={produs.culori || []}
        onSelect={handleColorSelect}
        productName={produs.nume}
      />
    </>
  );
}

