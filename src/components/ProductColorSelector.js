"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

export default function ProductColorSelector({ produs }) {
  // Extrage numele culorilor (suport pentru obiecte și string-uri)
  const getColorName = (color) => {
    if (!color) return "";
    if (typeof color === "string") return color;
    if (typeof color === "object" && color.nume) return color.nume;
    return "";
  };

  const getColorHex = (color) => {
    if (!color || typeof color === "string") return null;
    if (typeof color === "object" && color.hex) return color.hex;
    return null;
  };

  const firstColor = produs.culori && produs.culori.length === 1 ? produs.culori[0] : null;
  const [selectedColor, setSelectedColor] = useState(firstColor);

  // Dacă nu are culori sau are doar o culoare, afișează doar butonul
  if (!produs.culori || produs.culori.length === 0) {
    return <AddToCartButton produs={produs} size="lg" />;
  }

  if (produs.culori.length === 1) {
    return <AddToCartButton produs={produs} size="lg" selectedColor={getColorName(selectedColor)} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Selectează culoarea
        </label>
        <div className="flex flex-wrap gap-2">
          {produs.culori.map((color, index) => {
            const colorName = getColorName(color);
            const colorHex = getColorHex(color);
            const isSelected = selectedColor === color || (typeof selectedColor === "object" && selectedColor?.nume === colorName);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition flex items-center gap-2 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {colorHex && (
                  <span
                    className="h-4 w-4 rounded-full border border-zinc-300"
                    style={{ backgroundColor: colorHex }}
                  />
                )}
                {colorName}
              </button>
            );
          })}
        </div>
      </div>
      <AddToCartButton 
        produs={produs} 
        size="lg" 
        selectedColor={getColorName(selectedColor)}
      />
    </div>
  );
}

