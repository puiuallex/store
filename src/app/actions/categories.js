"use server";

import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { checkAdminAccess } from "./admin";

export async function getAllCategories() {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("nume", { ascending: true });

    if (error) {
      console.error("Eroare la obținerea categoriilor:", error);
      return { error: "A apărut o eroare la încărcarea categoriilor.", data: null };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

export async function createCategory(nume, userId = null) {
  try {
    if (!userId) {
      return { error: "Trebuie să fii autentificat pentru a crea o categorie." };
    }

    const adminCheck = await checkAdminAccess(userId);
    if (!adminCheck.isAdmin) {
      return { error: "Nu ai permisiunea de a crea categorii." };
    }

    if (!nume || nume.trim() === "") {
      return { error: "Numele categoriei este obligatoriu." };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat" };
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        nume: nume.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Eroare la crearea categoriei:", error);
      if (error.code === "23505") {
        return { error: "O categorie cu acest nume există deja." };
      }
      return { error: "A apărut o eroare la crearea categoriei." };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată." };
  }
}

export async function deleteCategory(categoryId, userId = null) {
  try {
    if (!userId) {
      return { error: "Trebuie să fii autentificat pentru a șterge o categorie." };
    }

    const adminCheck = await checkAdminAccess(userId);
    if (!adminCheck.isAdmin) {
      return { error: "Nu ai permisiunea de a șterge categorii." };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat" };
    }

    // Obține numele categoriei
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("nume")
      .eq("id", categoryId)
      .single();

    if (categoryError || !category) {
      console.error("Eroare la obținerea categoriei:", categoryError);
      return { error: "Categoria nu a fost găsită." };
    }

    // Verifică dacă există produse care folosesc această categorie
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("categorie", category.nume)
      .limit(1);

    if (productsError) {
      console.error("Eroare la verificarea produselor:", productsError);
      return { error: "A apărut o eroare la verificarea categoriei." };
    }

    if (products && products.length > 0) {
      return { error: "Nu poți șterge această categorie deoarece există produse care o folosesc." };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Eroare la ștergerea categoriei:", error);
      return { error: "A apărut o eroare la ștergerea categoriei." };
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată." };
  }
}

