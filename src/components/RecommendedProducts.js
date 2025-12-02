"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";
import Link from "next/link";

export default function RecommendedProducts({ produse, maxItems = 6 }) {
  // Selectează produse recomandate: preferă produsele cu oferte, apoi cele noi, apoi restul
  // Folosim sortare deterministă pentru a evita erorile de hydration
  const recommendedProducts = useMemo(() => {
    if (!produse || produse.length === 0) return [];
    
    // Creează o copie pentru a nu modifica array-ul original
    const sorted = [...produse];
    
    // Sortare deterministă: produse cu oferte primele, apoi produse noi, apoi restul
    // Folosim ID-ul pentru a asigura o ordine consistentă
    sorted.sort((a, b) => {
      const aHasOffer = a.pret_oferta && a.pret_oferta < a.pret;
      const bHasOffer = b.pret_oferta && b.pret_oferta < b.pret;
      const aIsNew = a.noutate === true;
      const bIsNew = b.noutate === true;
      
      // Produse cu oferte primele
      if (aHasOffer && !bHasOffer) return -1;
      if (!aHasOffer && bHasOffer) return 1;
      
      // Apoi produse noi
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      
      // Pentru produsele cu același status, sortăm după ID pentru consistență
      // Astfel serverul și clientul vor genera aceeași ordine
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    
    return sorted.slice(0, maxItems);
  }, [produse, maxItems]);

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

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="pt-6 lg:pt-8 pb-6 lg:pb-8">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-2">Recomandări</p>
          <h2 className="text-2xl lg:text-3xl font-semibold text-zinc-900">
            Produse care te-ar putea interesa
          </h2>
        </div>
        <Link
          href="/"
          className="hidden text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition lg:inline-block"
        >
          Vezi toate →
        </Link>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden pb-2" ref={emblaRef}>
          <div className="flex gap-4 lg:gap-8">
            {recommendedProducts.map((produs) => (
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
        {recommendedProducts.length > 2 && (
          <>
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-10 flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              aria-label="Produs anterior"
            >
              <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-10 flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              aria-label="Produs următor"
            >
              <ChevronRightIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-center lg:hidden">
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          Vezi toate produsele →
        </Link>
      </div>
    </section>
  );
}


