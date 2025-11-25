"use server";

import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { checkAdminAccess } from "./admin";

export async function getAllProducts() {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Eroare la obținerea produselor:", error);
      return { error: "A apărut o eroare la încărcarea produselor.", data: null };
    }

    // Transformă datele pentru a fi compatibile cu structura existentă
    const produse = (data || []).map((product) => {
      const imagini = product.imagini || (product.imagine ? [product.imagine] : []);
      return {
        id: product.id,
        nume: product.nume,
        descriere: product.descriere,
        pret: parseFloat(product.pret),
        pret_oferta: product.pret_oferta ? parseFloat(product.pret_oferta) : null,
        categorie: product.categorie,
        culori: product.culori || [],
        imagini: imagini,
        imagine: imagini[0] || null, // Prima imagine pentru compatibilitate
        noutate: product.noutate || false,
        stoc: product.stoc !== undefined ? product.stoc : true,
      };
    });

    return { data: produse, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

export async function getProductById(productId) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Eroare la obținerea produsului:", error);
      return { error: "Produsul nu a fost găsit.", data: null };
    }

    if (!data) {
      return { error: "Produsul nu a fost găsit.", data: null };
    }

    // Transformă datele pentru a fi compatibile cu structura existentă
    const imagini = data.imagini || (data.imagine ? [data.imagine] : []);
    const produs = {
      id: data.id,
      nume: data.nume,
      descriere: data.descriere,
      pret: parseFloat(data.pret),
      pret_oferta: data.pret_oferta ? parseFloat(data.pret_oferta) : null,
      categorie: data.categorie,
      culori: data.culori || [],
      imagini: imagini,
      imagine: imagini[0] || null, // Prima imagine pentru compatibilitate
      noutate: data.noutate || false,
      stoc: data.stoc !== undefined ? data.stoc : true,
    };

    return { data: produs, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

// Creează un produs nou (doar pentru admin)
export async function createProduct(productData, userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const imagini = productData.imagini || (productData.imagine ? [productData.imagine] : []);
    const primaImagine = imagini.length > 0 ? imagini[0] : null;

    const { data, error } = await supabase
      .from("products")
      .insert({
        id: productData.id,
        nume: productData.nume,
        descriere: productData.descriere,
        pret: productData.pret,
        pret_oferta: productData.pret_oferta || null,
        categorie: productData.categorie,
        culori: productData.culori || [],
        imagini: imagini,
        imagine: primaImagine, // Prima imagine pentru compatibilitate
        noutate: productData.noutate || false,
        stoc: productData.stoc !== undefined ? productData.stoc : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Eroare la crearea produsului:", error);
      return { error: "A apărut o eroare la crearea produsului.", data: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

// Actualizează un produs (doar pentru admin)
export async function updateProduct(productId, productData, userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const imagini = productData.imagini || (productData.imagine ? [productData.imagine] : []);
    const primaImagine = imagini.length > 0 ? imagini[0] : null;

    const { data, error } = await supabase
      .from("products")
      .update({
        nume: productData.nume,
        descriere: productData.descriere,
        pret: productData.pret,
        pret_oferta: productData.pret_oferta || null,
        categorie: productData.categorie,
        culori: productData.culori || [],
        imagini: imagini,
        imagine: primaImagine, // Prima imagine pentru compatibilitate
        noutate: productData.noutate || false,
        stoc: productData.stoc !== undefined ? productData.stoc : true,
      })
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Eroare la actualizarea produsului:", error);
      return { error: "A apărut o eroare la actualizarea produsului.", data: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

// Șterge un produs (doar pentru admin)
export async function deleteProduct(productId, userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      console.error("Eroare la ștergerea produsului:", error);
      return { error: "A apărut o eroare la ștergerea produsului.", data: null };
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

