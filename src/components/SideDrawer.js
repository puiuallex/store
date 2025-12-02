"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Componentă reutilizabilă pentru drawer-uri laterale (side panels)
 * Folosită pentru meniuri mobile, filtre, etc.
 * 
 * @param {boolean} isOpen - Starea de deschidere/închidere a drawer-ului
 * @param {function} onClose - Funcție apelată când se închide drawer-ul
 * @param {ReactNode|string} title - Titlul sau conținutul header-ului
 * @param {ReactNode} children - Conținutul drawer-ului
 * @param {string} width - Lățimea drawer-ului (default: "w-80 max-w-[85vw]")
 * @param {number} zIndexOverlay - Z-index pentru overlay (default: 100)
 * @param {number} zIndexDrawer - Z-index pentru drawer (default: 110)
 * @param {string} position - Poziția drawer-ului: "left" sau "right" (default: "left")
 * @param {function} onOverlayClick - Funcție custom pentru click pe overlay (opțional)
 */
export default function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
  width = "w-80 max-w-[85vw]",
  zIndexOverlay = 100,
  zIndexDrawer = 110,
  position = "left",
  onOverlayClick,
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Gestionează render-ul pentru animație smooth
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(false);
      // Așteaptă un frame pentru a permite browser-ului să detecteze schimbarea
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10); // Mic delay pentru a permite reflow
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Așteaptă ca animația să se termine înainte de a elimina din DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Durata animației
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (onOverlayClick) {
      onOverlayClick();
    } else {
      onClose();
    }
  };

  const positionClasses = position === "right" 
    ? "right-0" 
    : "left-0";

  // Clase pentru animație slide
  const transformClasses = position === "right"
    ? (isAnimating ? "translate-x-0" : "translate-x-full")
    : (isAnimating ? "translate-x-0" : "-translate-x-full");

  // Clase pentru overlay fade
  const overlayClasses = isOpen 
    ? "opacity-100 visible" 
    : "opacity-0 invisible";

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay cu animație fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out ${overlayClasses}`}
        style={{ zIndex: zIndexOverlay }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Drawer cu animație slide */}
      <div
        className={`fixed inset-y-0 ${positionClasses} h-full ${width} bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${transformClasses}`}
        style={{ zIndex: zIndexDrawer }}
      >
        <div className="flex flex-col h-full">
          {/* Header cu titlu și buton închidere */}
          <div className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-4 bg-zinc-900/50">
            <div className="flex-1 min-w-0">
              {typeof title === "string" ? (
                <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-orbitron)] tracking-tight">
                  {title}
                </h2>
              ) : (
                title
              )}
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20 flex-shrink-0 ml-3"
              onClick={onClose}
              aria-label="Închide meniul"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Conținut scrollable */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

