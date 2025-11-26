"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ProductImageGallery({ imagini, nume }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!imagini || imagini.length === 0) {
    return (
      <div className="relative h-[300px] lg:h-[480px] overflow-hidden rounded-2xl lg:rounded-3xl bg-zinc-100">
        <div className="flex h-full items-center justify-center text-zinc-400 text-sm lg:text-base">
          Fără imagine
        </div>
      </div>
    );
  }

  const selectedImage = imagini[selectedIndex];

  // Pregătește imagini pentru lightbox
  const lightboxSlides = imagini.map((imagine) => ({
    src: imagine,
    alt: `${nume} - Imagine`,
  }));

  return (
    <>
      <div className="space-y-3 lg:space-y-4">
        {/* Imagine principală - clickable pentru lightbox */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative h-[300px] lg:h-[480px] overflow-hidden rounded-2xl lg:rounded-3xl bg-zinc-100 cursor-zoom-in group"
        >
          <Image
            src={selectedImage}
            alt={`${nume} - Imagine ${selectedIndex + 1}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={selectedIndex === 0}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
        </div>

      {/* Thumbnails */}
      {imagini.length > 1 && (
        <div className="grid grid-cols-4 gap-2 lg:gap-3">
          {imagini.map((imagine, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 lg:h-24 overflow-hidden rounded-xl lg:rounded-2xl border-2 transition ${
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

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={lightboxSlides}
        on={{ view: ({ index }) => setSelectedIndex(index) }}
      />
    </>
  );
}




