import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase nu este configurat" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Nu a fost selectat niciun fișier" }, { status: 400 });
    }

    // Verifică tipul fișierului
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Fișierul trebuie să fie o imagine" }, { status: 400 });
    }

    // Verifică dimensiunea (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Imaginea este prea mare. Dimensiunea maximă este 5MB" },
        { status: 400 }
      );
    }

    // Generează un nume unic pentru fișier
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Convertește fișierul la buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload în Supabase Storage
    const { data, error } = await supabase.storage.from("product-images").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error("Eroare la upload:", error);
      return NextResponse.json(
        { error: "A apărut o eroare la încărcarea imaginii" },
        { status: 500 }
      );
    }

    // Obține URL-ul public al imaginii
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl, path: filePath });
  } catch (error) {
    console.error("Eroare neașteptată:", error);
    return NextResponse.json(
      { error: "A apărut o eroare neașteptată" },
      { status: 500 }
    );
  }
}



