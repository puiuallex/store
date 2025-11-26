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
      .select(`
        *,
        product_categories (
          category_id,
          categories (
            id,
            nume
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Eroare la obținerea produselor:", error);
      return { error: "A apărut o eroare la încărcarea produselor.", data: null };
    }

    // Transformă datele pentru a fi compatibile cu structura existentă
    const produse = (data || []).map((product) => {
      const imagini = product.imagini || (product.imagine ? [product.imagine] : []);
      // Extrage categoriile din relația many-to-many
      const categorii = (product.product_categories || [])
        .map((pc) => pc.categories?.nume)
        .filter(Boolean);
      
      return {
        id: product.id,
        nume: product.nume,
        descriere: product.descriere,
        pret: parseFloat(product.pret),
        pret_oferta: product.pret_oferta ? parseFloat(product.pret_oferta) : null,
        categorie: categorii.length > 0 ? categorii[0] : product.categorie || "", // Prima categorie pentru compatibilitate
        categorii: categorii, // Toate categoriile
        culori: product.culori || [],
        imagini: imagini,
        imagine: imagini[0] || null, // Prima imagine pentru compatibilitate
        noutate: product.noutate || false,
        stoc: product.stoc !== undefined ? product.stoc : true,
        personalizat: product.personalizat || false,
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
      .select(`
        *,
        product_categories (
          category_id,
          categories (
            id,
            nume
          )
        )
      `)
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
    // Extrage categoriile din relația many-to-many
    const categorii = (data.product_categories || [])
      .map((pc) => pc.categories?.nume)
      .filter(Boolean);
    
    const produs = {
      id: data.id,
      nume: data.nume,
      descriere: data.descriere,
      pret: parseFloat(data.pret),
      pret_oferta: data.pret_oferta ? parseFloat(data.pret_oferta) : null,
      categorie: categorii.length > 0 ? categorii[0] : data.categorie || "", // Prima categorie pentru compatibilitate
      categorii: categorii, // Toate categoriile
      culori: data.culori || [],
      imagini: imagini,
      imagine: imagini[0] || null, // Prima imagine pentru compatibilitate
      noutate: data.noutate || false,
      stoc: data.stoc !== undefined ? data.stoc : true,
      personalizat: data.personalizat || false,
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
    
    // Procesează categoriile - poate fi array sau string
    const categoriiNume = Array.isArray(productData.categorii) 
      ? productData.categorii 
      : (productData.categorie ? [productData.categorie] : []);

    const { data, error } = await supabase
      .from("products")
      .insert({
        id: productData.id,
        nume: productData.nume,
        descriere: productData.descriere,
        pret: productData.pret,
        pret_oferta: productData.pret_oferta || null,
        categorie: categoriiNume[0] || null, // Prima categorie pentru compatibilitate
        culori: productData.culori || [],
        imagini: imagini,
        imagine: primaImagine, // Prima imagine pentru compatibilitate
        noutate: productData.noutate || false,
        stoc: productData.stoc !== undefined ? productData.stoc : true,
        personalizat: productData.personalizat || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Eroare la crearea produsului:", error);
      return { error: "A apărut o eroare la crearea produsului.", data: null };
    }

    // Creează legăturile cu categoriile
    if (categoriiNume.length > 0) {
      // Găsește ID-urile categoriilor
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, nume")
        .in("nume", categoriiNume);

      if (categoriesError) {
        console.error("Eroare la obținerea categoriilor:", categoriesError);
      } else if (categories && categories.length > 0) {
        // Creează legăturile
        const productCategories = categories.map((cat) => ({
          product_id: data.id,
          category_id: cat.id,
        }));

        const { error: linkError } = await supabase
          .from("product_categories")
          .insert(productCategories);

        if (linkError) {
          console.error("Eroare la crearea legăturilor cu categoriile:", linkError);
        }
      }
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
    
    // Procesează categoriile - poate fi array sau string
    const categoriiNume = Array.isArray(productData.categorii) 
      ? productData.categorii 
      : (productData.categorie ? [productData.categorie] : []);

    const { data, error } = await supabase
      .from("products")
      .update({
        nume: productData.nume,
        descriere: productData.descriere,
        pret: productData.pret,
        pret_oferta: productData.pret_oferta || null,
        categorie: categoriiNume[0] || null, // Prima categorie pentru compatibilitate
        culori: productData.culori || [],
        imagini: imagini,
        imagine: primaImagine, // Prima imagine pentru compatibilitate
        noutate: productData.noutate || false,
        stoc: productData.stoc !== undefined ? productData.stoc : true,
        personalizat: productData.personalizat || false,
      })
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Eroare la actualizarea produsului:", error);
      return { error: "A apărut o eroare la actualizarea produsului.", data: null };
    }

    // Actualizează legăturile cu categoriile
    // Șterge legăturile vechi
    const { error: deleteError } = await supabase
      .from("product_categories")
      .delete()
      .eq("product_id", productId);

    if (deleteError) {
      console.error("Eroare la ștergerea legăturilor vechi:", deleteError);
    }

    // Creează legăturile noi
    if (categoriiNume.length > 0) {
      // Găsește ID-urile categoriilor
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, nume")
        .in("nume", categoriiNume);

      if (categoriesError) {
        console.error("Eroare la obținerea categoriilor:", categoriesError);
      } else if (categories && categories.length > 0) {
        // Creează legăturile
        const productCategories = categories.map((cat) => ({
          product_id: productId,
          category_id: cat.id,
        }));

        const { error: linkError } = await supabase
          .from("product_categories")
          .insert(productCategories);

        if (linkError) {
          console.error("Eroare la crearea legăturilor cu categoriile:", linkError);
        }
      }
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

