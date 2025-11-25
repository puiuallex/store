/**
 * Script pentru a popula baza de date Supabase cu produsele existente
 * 
 * Rulare:
 * npm run seed:products
 * 
 * Notă: Asigură-te că ai variabilele de mediu setate în .env.local
 */

const { createClient } = require("@supabase/supabase-js");
const { readFileSync } = require("fs");
const { join } = require("path");

// Încarcă variabilele de mediu din .env.local
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const envFile = readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    });
  } catch (error) {
    console.warn("⚠️  Nu s-a putut încărca .env.local, folosind variabilele de mediu existente");
  }
}

loadEnvFile();

// Obține credențialele din variabilele de mediu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Eroare: NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY trebuie să fie setate în .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Produsele hardcodate (din products.js)
const produse = [
  {
    id: "orbit-lamp",
    nume: "Lampă Orbită",
    descriere: "Corp de iluminat din PLA mat și difuzor PETG pentru o lumină caldă pe birou.",
    pret: 249,
    timpProductie: "3 zile",
    categorie: "Iluminat",
    culori: ["Grafit", "Ivory", "Verde mentă"],
    materiale: ["PLA mat", "PETG translucid"],
    imagine: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    noutate: true,
    stoc: true,
  },
  {
    id: "nexus-vase",
    nume: "Vază Nexus",
    descriere: "Textură organică și stratificare vizibilă care pune în valoare florile delicate.",
    pret: 189,
    timpProductie: "2 zile",
    categorie: "Decor",
    culori: ["Albastru Ardezie", "Roșu Terracotta"],
    materiale: ["PLA satin", "Vopsea acrilică"],
    imagine: "https://images.unsplash.com/photo-1523419409543-0c1df022bddb?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
  {
    id: "flux-tray",
    nume: "Tavă Flux",
    descriere: "Suport modular pentru birou, cu inserții magnetice pentru accesorii mici.",
    pret: 139,
    timpProductie: "1 zi",
    categorie: "Birou",
    culori: ["Negru Onix", "Bej Desert"],
    materiale: ["PLA Pro", "Magnet neodim"],
    imagine: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
  {
    id: "aero-hook",
    nume: "Set Cârlige Aero",
    descriere: "Cârlige aerodinamice pentru perete, gândite să suporte până la 5kg fiecare.",
    pret: 99,
    timpProductie: "1 zi",
    categorie: "Utilitar",
    culori: ["Piatră", "Gri Ciment"],
    materiale: ["PETG ranforsat"],
    imagine: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    noutate: true,
    stoc: true,
  },
  {
    id: "zen-planter",
    nume: "Ghiveci Zen",
    descriere: "Formă ondulată inspirată de grădinile japoneze, cu rezervor intern pentru apă.",
    pret: 159,
    timpProductie: "2 zile",
    categorie: "Decor",
    culori: ["Alb Mineral", "Cărbune"],
    materiale: ["PLA+ cu tratament hidro"],
    imagine: "https://images.unsplash.com/photo-1438109491414-7198515b166b?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: false,
  },
  {
    id: "motion-stand",
    nume: "Stand Motion",
    descriere: "Suport reglabil pentru laptop sau tabletă, cu nervuri interne pentru rigiditate.",
    pret: 199,
    timpProductie: "2 zile",
    categorie: "Birou",
    culori: ["Grafit", "Olive închis"],
    materiale: ["PETG Carbon", "Paduri silicon"],
    imagine: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
  {
    id: "pulse-clock",
    nume: "Ceas Pulse",
    descriere: "Cadran minimalist, numerotare perforată și mecanism silențios inclus.",
    pret: 279,
    timpProductie: "4 zile",
    categorie: "Decor",
    culori: ["Aluminiu", "Bronz periat"],
    materiale: ["PLA metalizat", "PETG translucid"],
    imagine: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80",
    noutate: true,
    stoc: true,
  },
  {
    id: "linq-organizer",
    nume: "Organizator Linq",
    descriere: "Set modular de cutii cu ghidaje, ideal pentru accesorii creative sau ateliere.",
    pret: 149,
    timpProductie: "1 zi",
    categorie: "Utilitar",
    culori: ["Gri bazalt", "Portocaliu neon"],
    materiale: ["PLA Pro", "Filț reciclat"],
    imagine: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
  {
    id: "arc-lamp",
    nume: "Lampă Arc",
    descriere: "Lampă articulată pentru citit, cu braț imprimat în strat sub 0.15mm pentru detalii fine.",
    pret: 329,
    timpProductie: "4 zile",
    categorie: "Iluminat",
    culori: ["Negru mat", "Cupru"],
    materiale: ["PLA Pro", "LED cald"],
    imagine: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
  {
    id: "rise-bookend",
    nume: "Suport Cărți Rise",
    descriere: "Pereche de suporturi parametrice care împiedică alunecarea cărților grele.",
    pret: 119,
    timpProductie: "1 zi",
    categorie: "Birou",
    culori: ["Albastru regal", "Alb arctic"],
    materiale: ["PLA dur", "Bază cauciucată"],
    imagine: "https://images.unsplash.com/photo-1455885666463-1c4b5d52f455?auto=format&fit=crop&w=800&q=80",
    noutate: false,
    stoc: true,
  },
];

async function seedProducts() {
  console.log("🌱 Încep popularea bazei de date cu produse...\n");

  // Transformă produsele pentru a fi compatibile cu schema bazei de date
  const productsToInsert = produse.map((produs) => ({
    id: produs.id,
    nume: produs.nume,
    descriere: produs.descriere,
    pret: produs.pret,
    timp_productie: produs.timpProductie,
    categorie: produs.categorie,
    culori: produs.culori,
    materiale: produs.materiale,
    imagine: produs.imagine,
    noutate: produs.noutate || false,
    stoc: produs.stoc !== undefined ? produs.stoc : true,
  }));

  // Șterge produsele existente (opțional - comentează dacă nu vrei să ștergi)
  console.log("🗑️  Șterg produsele existente...");
  const { error: deleteError } = await supabase.from("products").delete().neq("id", "");

  if (deleteError) {
    console.warn("⚠️  Avertisment la ștergerea produselor existente:", deleteError.message);
  } else {
    console.log("✅ Produsele existente au fost șterse.\n");
  }

  // Inserează produsele
  console.log(`📦 Inserez ${productsToInsert.length} produse...\n`);

  const { data, error } = await supabase
    .from("products")
    .insert(productsToInsert)
    .select();

  if (error) {
    console.error("❌ Eroare la inserarea produselor:", error);
    process.exit(1);
  }

  console.log(`✅ ${data.length} produse au fost inserate cu succes!\n`);
  console.log("📋 Produse inserate:");
  data.forEach((produs) => {
    console.log(`   - ${produs.nume} (${produs.id})`);
  });

  console.log("\n🎉 Popularea bazei de date a fost finalizată cu succes!");
}

seedProducts().catch((error) => {
  console.error("❌ Eroare neașteptată:", error);
  process.exit(1);
});
