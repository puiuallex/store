"use server";

import { createServerSupabaseClient } from "@/lib/supabaseClient";

export async function subscribeToNewsletter(email) {
  try {
    if (!email || !email.includes("@")) {
      return { error: "Te rugăm să introduci un email valid." };
    }

    // Normalizează email-ul (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat" };
    }

    // Verifică dacă email-ul există deja
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      if (existing.status === "active") {
        return { error: "Acest email este deja abonat la newsletter." };
      } else {
        // Reactualizează abonarea dacă utilizatorul s-a dezabonat anterior
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ status: "active" })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Eroare la reactualizarea abonării:", updateError);
          return { error: "A apărut o eroare. Te rugăm să încerci din nou." };
        }

        return { data: { email: normalizedEmail, reactivated: true }, error: null };
      }
    }

    // Creează o nouă abonare
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Eroare la abonarea la newsletter:", error);
      
      // Dacă email-ul există deja (duplicate key error)
      if (error.code === "23505") {
        return { error: "Acest email este deja abonat la newsletter." };
      }
      
      return { error: "A apărut o eroare la abonare. Te rugăm să încerci din nou." };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată. Te rugăm să încerci din nou." };
  }
}

export async function getAllNewsletterSubscribers(userId = null) {
  try {
    // Verifică dacă utilizatorul este admin
    const { checkAdminAccess } = await import("./admin");
    const adminCheck = await checkAdminAccess(userId);
    
    if (!adminCheck.isAdmin) {
      return { error: "Acces neautorizat.", data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Eroare la obținerea abonaților:", error);
      return { error: "A apărut o eroare la încărcarea abonaților.", data: null };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}






