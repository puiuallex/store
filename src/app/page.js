import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/app/actions/products";

export default async function Home() {
  const { data: produse, error } = await getAllProducts();

  if (error || !produse) {
    return (
      <div className="space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
          <h1 className="text-4xl font-semibold text-zinc-900">Produsele noastre</h1>
        </header>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-rose-800">{error || "Nu s-au putut încărca produsele."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
        <h1 className="text-4xl font-semibold text-zinc-900">Produsele noastre</h1>
        <p className="text-zinc-600">
          Selectează un produs pentru detalii și
          adaugă-l în coș.
        </p>
      </header>
      {produse.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center">
          <p className="text-lg font-semibold text-zinc-900">Nu există produse disponibile</p>
          <p className="mt-2 text-sm text-zinc-600">
            Produsele vor apărea aici când vor fi adăugate.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {produse.map((produs) => (
            <ProductCard key={produs.id} produs={produs} />
          ))}
        </div>
      )}
    </div>
  );
}
