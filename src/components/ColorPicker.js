"use client";

import { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";

// Culori predefinite comune pentru un magazin online
const PREDEFINED_COLORS = [
  { nume: "Negru", hex: "#000000" },
  { nume: "Alb", hex: "#FFFFFF" },
  { nume: "Grafit", hex: "#36454F" },
  { nume: "Gri", hex: "#808080" },
  { nume: "Bej", hex: "#F5F5DC" },
  { nume: "Ivory", hex: "#FFFFF0" },
  { nume: "Maro", hex: "#8B4513" },
  { nume: "Roșu", hex: "#FF0000" },
  { nume: "Albastru", hex: "#0000FF" },
  { nume: "Verde", hex: "#008000" },
  { nume: "Galben", hex: "#FFFF00" },
  { nume: "Portocaliu", hex: "#FFA500" },
  { nume: "Roz", hex: "#FFC0CB" },
  { nume: "Mov", hex: "#800080" },
  { nume: "Turcoaz", hex: "#40E0D0" },
  { nume: "Verde mentă", hex: "#98FF98" },
];

export default function ColorPicker({ value, onChange, onDelete }) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value?.hex || "#000000");
  const pickerRef = useRef(null);

  // Închide picker-ul când se face click în afara lui
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handlePredefinedSelect = (color) => {
    onChange({ nume: color.nume, hex: color.hex });
    setShowPicker(false);
  };

  const handleCustomColorChange = (color) => {
    setCustomColor(color.hex);
  };

  const handleCustomColorApply = () => {
    onChange({ nume: value?.nume || "", hex: customColor });
    setShowPicker(false);
  };

  const currentColor = value?.hex || "#000000";
  const currentName = value?.nume || "";

  return (
    <div className="space-y-3">
      {/* Afișare culoare curentă și nume */}
      <div className="flex items-center gap-2">
        <div
          className="h-12 w-12 rounded-lg border-2 border-zinc-200 shadow-sm cursor-pointer transition hover:scale-105"
          style={{ backgroundColor: currentColor }}
          onClick={() => setShowPicker(!showPicker)}
          title="Click pentru a deschide picker-ul"
        />
        <input
          type="text"
          value={currentName}
          onChange={(e) => onChange({ nume: e.target.value, hex: currentColor })}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          placeholder="ex: Grafit"
        />
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Șterge
          </button>
        )}
      </div>

      {/* Picker de culori */}
      {showPicker && (
        <div className="relative z-50" ref={pickerRef}>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
            {/* Culori predefinite */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-zinc-600 mb-2">Culori comune</p>
              <div className="grid grid-cols-8 gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color.nume}
                    type="button"
                    onClick={() => handlePredefinedSelect(color)}
                    className={`h-8 w-8 rounded-lg border-2 transition hover:scale-110 ${
                      currentColor.toLowerCase() === color.hex.toLowerCase()
                        ? "border-emerald-500 ring-2 ring-emerald-500/30"
                        : "border-zinc-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.nume}
                  />
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="my-4 border-t border-zinc-200" />

            {/* Picker custom */}
            <div>
              <p className="text-xs font-semibold text-zinc-600 mb-2">Culoare personalizată</p>
              <div className="space-y-3">
                <div className="[&_.sketch-picker]:w-full [&_.sketch-picker]:box-border">
                  <SketchPicker
                    color={customColor}
                    onChange={handleCustomColorChange}
                    width="100%"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-lg border-2 border-zinc-200"
                    style={{ backgroundColor: customColor }}
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const hex = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(hex)) {
                        setCustomColor(hex);
                      }
                    }}
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono text-zinc-800 outline-none transition focus:border-emerald-500"
                    placeholder="#000000"
                    maxLength={7}
                  />
                  <button
                    type="button"
                    onClick={handleCustomColorApply}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    Aplică
                  </button>
                </div>
              </div>
            </div>

            {/* Buton închidere */}
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

