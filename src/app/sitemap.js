import { getAllProducts } from "@/app/actions/products";

export default async function sitemap() {
  const baseUrl = "https://creatinglayers.ro"; // Actualizează cu domeniul tău real
  
  const { data: produse } = await getAllProducts() || { data: [] };
  
  const productUrls = (produse || []).map((produs) => ({
    url: `${baseUrl}/produse/${produs.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/livrare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...productUrls,
  ];
}





