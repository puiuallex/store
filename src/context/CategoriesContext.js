"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAllCategories } from "@/app/actions/categories";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children, initialCategories = null }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);
  const [error, setError] = useState(null);

  // Încarcă categoriile dacă nu au fost pasate inițial
  useEffect(() => {
    if (!initialCategories && categories.length === 0) {
      setLoading(true);
      getAllCategories()
        .then((result) => {
          if (result.data) {
            setCategories(result.data);
            setError(null);
          } else {
            setError(result.error || "Eroare la încărcarea categoriilor");
          }
        })
        .catch((err) => {
          console.error("Eroare la încărcarea categoriilor:", err);
          setError("A apărut o eroare la încărcarea categoriilor");
        })
        .finally(() => setLoading(false));
    }
  }, [initialCategories, categories.length]);

  const refreshCategories = useCallback(() => {
    setLoading(true);
    getAllCategories()
      .then((result) => {
        if (result.data) {
          setCategories(result.data);
          setError(null);
        } else {
          setError(result.error || "Eroare la încărcarea categoriilor");
        }
      })
      .catch((err) => {
        console.error("Eroare la încărcarea categoriilor:", err);
        setError("A apărut o eroare la încărcarea categoriilor");
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      refreshCategories,
    }),
    [categories, loading, error, refreshCategories],
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories trebuie folosit în interiorul CategoriesProvider");
  }
  return context;
}

