"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "creating-layers-cart";

function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignoră erorile de localStorage
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Încarcă coșul din localStorage la mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    // Folosim setTimeout pentru a evita setState sincron în effect
    setTimeout(() => {
      setItems(savedItems);
      setIsHydrated(true);
    }, 0);
  }, []);

  // Salvează coșul în localStorage când se schimbă
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((product, quantity = 1, color = null) => {
    setItems((current) => {
      // Verifică dacă există deja același produs cu aceeași culoare
      const existing = current.find(
        (item) => item.id === product.id && item.color === color
      );
      
      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.nume,
          price: product.pret_oferta || product.pret,
          image: product.imagine,
          quantity,
          color: color || null,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id, color = null) => {
    setItems((current) => 
      current.filter((item) => !(item.id === id && item.color === color))
    );
  }, []);

  const updateQuantity = useCallback((id, quantity, color = null) => {
    if (quantity <= 0) {
      removeItem(id, color);
      return;
    }
    setItems((current) =>
      current.map((item) => 
        (item.id === id && item.color === color) ? { ...item, quantity } : item
      ),
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    }),
    [items, subtotal, itemCount, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart trebuie folosit în interiorul CartProvider");
  }
  return context;
}

