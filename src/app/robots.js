export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://creatinglayers.ro/sitemap.xml", // Actualizează cu domeniul tău real
  };
}


