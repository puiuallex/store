import { getAllProducts } from "@/app/actions/products";

export default async function sitemap() {
  const baseUrl = "https://creatinglayers.ro";
  const now = new Date();
  
  const { data: produse } = await getAllProducts() || { data: [] };
  
  // Pentru produse, folosim updated_at dacă este disponibil, altfel created_at
  const productUrls = (produse || []).map((produs) => {
    // Încearcă să obțină updated_at sau created_at din produs
    let lastModified = now;
    if (produs.updated_at) {
      lastModified = new Date(produs.updated_at);
    } else if (produs.created_at) {
      lastModified = new Date(produs.created_at);
    }
    
    return {
      url: `${baseUrl}/produse/${produs.id}`,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // Pagini statice cu lastModified setat la o dată fixă (ultima actualizare majoră)
  const staticPagesLastModified = new Date("2024-01-01");

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/despre`,
      lastModified: staticPagesLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticPagesLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/livrare`,
      lastModified: staticPagesLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/confidentialitate`,
      lastModified: staticPagesLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termeni`,
      lastModified: staticPagesLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...productUrls,
  ];
}






