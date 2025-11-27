"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function ProductDescription({ descriere }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Verifică dacă descrierea este lungă (mai mult de ~150 caractere sau 3 linii)
  const isLong = descriere && descriere.length > 150;
  
  if (!descriere) {
    return null;
  }

  return (
    <div>
      <p
        className={`text-sm lg:text-base text-zinc-600 leading-relaxed whitespace-pre-line ${
          isLong && !isExpanded ? "line-clamp-3" : ""
        }`}
      >
        {descriere}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          {isExpanded ? (
            <>
              <span>Citește mai puțin</span>
              <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Citește mai mult</span>
              <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}


