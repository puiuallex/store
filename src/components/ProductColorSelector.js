"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

export default function ProductColorSelector({ produs }) {
  const [selectedColor, setSelectedColor] = useState(
    produs.culori && produs.culori.length === 1 ? produs.culori[0] : null
  );

  // Dacă nu are culori sau are doar o culoare, afișează doar butonul
  if (!produs.culori || produs.culori.length === 0) {
    return <AddToCartButton produs={produs} size="lg" />;
  }

  if (produs.culori.length === 1) {
    return <AddToCartButton produs={produs} size="lg" selectedColor={selectedColor} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Selectează culoarea
        </label>
        <div className="flex flex-wrap gap-2">
          {produs.culori.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition ${
                selectedColor === color
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
      <AddToCartButton 
        produs={produs} 
        size="lg" 
        selectedColor={selectedColor}
      />
    </div>
  );
}

