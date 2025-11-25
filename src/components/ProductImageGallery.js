"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ imagini, nume }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!imagini || imagini.length === 0) {
    return (
      <div className="relative h-[480px] overflow-hidden rounded-3xl bg-zinc-100">
        <div className="flex h-full items-center justify-center text-zinc-400">
          Fără imagine
        </div>
      </div>
    );
  }

  const selectedImage = imagini[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Imagine principală */}
      <div className="relative h-[480px] overflow-hidden rounded-3xl bg-zinc-100">
        <Image
          src={selectedImage}
          alt={`${nume} - Imagine ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {imagini.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imagini.map((imagine, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-24 overflow-hidden rounded-2xl border-2 transition ${
                selectedIndex === index
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <Image
                src={imagine}
                alt={`${nume} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 12.5vw, 25vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



