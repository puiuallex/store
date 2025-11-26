import ProductCard from "./ProductCard";
import Link from "next/link";

export default function NewProducts({ produse }) {
  // Filtrează doar produsele marcate ca "nou"
  const newProducts = produse.filter((produs) => produs.noutate === true).slice(0, 4);

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-2">Noutăți</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900">
            Produse noi
          </h2>
        </div>
        <Link
          href="/?categorie=toate"
          className="hidden text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition lg:inline-block"
        >
          Vezi toate →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:gap-8 lg:grid-cols-4">
        {newProducts.map((produs) => (
          <ProductCard key={produs.id} produs={produs} />
        ))}
      </div>
      <div className="mt-6 text-center lg:hidden">
        <Link
          href="/?categorie=toate"
          className="inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          Vezi toate produsele →
        </Link>
      </div>
    </section>
  );
}

