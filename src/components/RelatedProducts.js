import ProductCard from "./ProductCard";

export default function RelatedProducts({ produse, currentProductId, maxItems = 4 }) {
  // Filtrează produsul curent și limitează numărul
  const relatedProducts = produse
    .filter((produs) => produs.id !== currentProductId)
    .slice(0, maxItems);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-zinc-900">
          Produse similare
        </h2>
        <p className="mt-2 text-zinc-600">
          Descoperă alte produse care te-ar putea interesa
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:gap-8 lg:grid-cols-4">
        {relatedProducts.map((produs) => (
          <ProductCard key={produs.id} produs={produs} />
        ))}
      </div>
    </section>
  );
}

