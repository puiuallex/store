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

// Obține statistici pentru dashboard (doar pentru admin)
export async function getAdminStats(userId = null) {
  try {
    const adminCheck = await checkAdminAccess(userId);

    if (!adminCheck.isAdmin) {
      return { error: adminCheck.error, data: null };
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return { error: "Supabase nu este configurat", data: null };
    }

    // Obține toate comenzile
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, total, subtotal, shipping_cost, created_at, status");

    if (ordersError) {
      console.error("Eroare la obținerea comenzilor:", ordersError);
    }

    // Obține toate produsele
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, stoc");

    if (productsError) {
      console.error("Eroare la obținerea produselor:", productsError);
    }

    // Obține abonații newsletter
    const { data: newsletter, error: newsletterError } = await supabase
      .from("newsletter_subscribers")
      .select("id, created_at, status")
      .eq("status", "active");

    if (newsletterError) {
      console.error("Eroare la obținerea abonaților:", newsletterError);
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const ordersList = orders || [];
    const productsList = products || [];
    const newsletterList = newsletter || [];

    // Calculează statistici
    const stats = {
      // Comenzi
      totalOrders: ordersList.length,
      newOrdersToday: ordersList.filter(
        (o) => new Date(o.created_at) >= todayStart && o.status === "nouă"
      ).length,
      totalRevenue: ordersList.reduce((sum, o) => sum + (parseFloat(o.total) || parseFloat(o.subtotal) || 0), 0),
      revenueToday: ordersList
        .filter((o) => new Date(o.created_at) >= todayStart)
        .reduce((sum, o) => sum + (parseFloat(o.total) || parseFloat(o.subtotal) || 0), 0),
      revenueThisWeek: ordersList
        .filter((o) => new Date(o.created_at) >= weekStart)
        .reduce((sum, o) => sum + (parseFloat(o.total) || parseFloat(o.subtotal) || 0), 0),
      revenueThisMonth: ordersList
        .filter((o) => new Date(o.created_at) >= monthStart)
        .reduce((sum, o) => sum + (parseFloat(o.total) || parseFloat(o.subtotal) || 0), 0),
      
      // Produse
      totalProducts: productsList.length,
      productsInStock: productsList.filter((p) => p.stoc).length,
      productsOutOfStock: productsList.filter((p) => !p.stoc).length,
      
      // Newsletter
      totalNewsletterSubscribers: newsletterList.length,
      newSubscribersToday: newsletterList.filter(
        (s) => new Date(s.created_at) >= todayStart
      ).length,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error("Eroare:", error);
    return { error: "A apărut o eroare neașteptată.", data: null };
  }
}

