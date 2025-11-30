"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ produse, currentProductId, maxItems = 4 }) {
  // Filtrează produsul curent și limitează numărul
  const relatedProducts = produse
    .filter((produs) => produs.id !== currentProductId)
    .slice(0, maxItems);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 1 },
    },
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="pt-6 lg:pt-8 pb-0">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-2">Recomandate</p>
          <h2 className="text-2xl lg:text-3xl font-semibold text-zinc-900">
            Produse similare
          </h2>
        </div>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden pb-2" ref={emblaRef}>
          <div className="flex gap-4 lg:gap-8">
            {relatedProducts.map((produs) => (
              <div
                key={produs.id}
                className="flex-[0_0_50%] lg:flex-[0_0_calc(33.333%-21.33px)] min-w-0 flex"
              >
                <div className="w-full">
                  <ProductCard produs={produs} noShadow={true} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Butoane de navigare */}
        {relatedProducts.length > 2 && (
          <>
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-10 flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Produs anterior"
            >
              <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-10 flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Produs următor"
            >
              <ChevronRightIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

