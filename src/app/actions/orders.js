"use server";

import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from "@/lib/email";

export async function createOrder(orderData, userId = null) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat" };
    }

    // userId este opțional - null pentru guest orders, sau ID-ul utilizatorului pentru comenzi autentificate

    // Calculează costul de livrare: 20 lei dacă subtotal <= 100, altfel gratuit
    const shippingCost = orderData.shipping_cost !== undefined 
      ? orderData.shipping_cost 
      : (orderData.subtotal <= 100 ? 20 : 0);
    const total = orderData.total !== undefined 
      ? orderData.total 
      : (orderData.subtotal + shippingCost);

    // Obține email-ul utilizatorului dacă este autentificat
    let userEmail = orderData.email || null;
    if (!userEmail && userId) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email) {
        userEmail = userData.user.email;
      }
    }

    // Creează comanda în baza de date
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId, // null pentru guest orders
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes || null,
        status: "nouă",
        payment_method: "ramburs",
      })
      .select()
      .single();

    if (error) {
      console.error("Eroare la crearea comenzii:", error);
      return { error: "A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou." };
    }

    // Trimite email-uri (nu blocăm procesul dacă trimiterea email-ului eșuează)
    if (data && data.id) {
      const emailData = {
        orderId: data.id,
        email: userEmail,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes || null,
      };

      // Trimite email de confirmare către client (dacă există email)
      if (userEmail) {
        sendOrderConfirmationEmail(emailData).catch(err => {
          console.error("Eroare la trimiterea email-ului de confirmare:", err);
        });
      }

      // Trimite notificare către admin
      sendOrderNotificationToAdmin(emailData).catch(err => {
        console.error("Eroare la trimiterea notificării către admin:", err);
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată. Te rugăm să încerci din nou." };
  }
}

export async function getOrderById(orderId, userId = null) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat" };
    }

    // Obține comanda după ID
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Eroare la obținerea comenzii:", error);
      return { error: "Comanda nu a fost găsită." };
    }

    // Verifică dacă utilizatorul are dreptul să vadă comanda
    // Pentru comenzi autentificate, verifică că user_id corespunde
    // Pentru comenzi guest (user_id este null), permitem accesul (deoarece nu avem alt mecanism de verificare)
    if (data.user_id) {
      // Comandă autentificată - verifică că utilizatorul este autentificat și că user_id corespunde
      if (!userId || data.user_id !== userId) {
        return { error: "Nu ai permisiunea să accesezi această comandă." };
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată." };
  }
}

