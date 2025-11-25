"use server";

import { createServerSupabaseClient } from "@/lib/supabaseClient";

// Verifică dacă utilizatorul este admin
export async function isAdmin(userId) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase || !userId) {
      return false;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    return !error && data !== null;
  } catch (error) {
    console.error("Eroare la verificarea admin:", error);
    return false;
  }
}

// Obține ID-ul utilizatorului din sesiune
// Notă: În server actions, este mai bine să primim userId ca parametru din client
export async function getCurrentUserId() {
  // Pentru server actions, returnăm null și vom folosi userId din parametri
  // Acest lucru este mai sigur și mai predictibil
  return null;
}

// Verifică dacă utilizatorul curent este admin
// Acceptă userId ca parametru opțional (din client)
export async function checkAdminAccess(userId = null) {
  const currentUserId = userId || (await getCurrentUserId());

  if (!currentUserId) {
    return { isAdmin: false, error: "Nu ești autentificat." };
  }

  const adminStatus = await isAdmin(currentUserId);

  if (!adminStatus) {
    return { isAdmin: false, error: "Nu ai drepturi de administrator." };
  }

  return { isAdmin: true, error: null };
}

// Obține toate comenzile (doar pentru admin)
export async function getAllOrders(userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Eroare la obținerea comenzilor:", error);
      return { error: "A apărut o eroare la încărcarea comenzilor.", data: null };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

// Actualizează statusul unei comenzi (doar pentru admin)
export async function updateOrderStatus(orderId, newStatus, userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Eroare la actualizarea comenzii:", error);
      return { error: "A apărut o eroare la actualizarea comenzii.", data: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

