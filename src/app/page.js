import { Suspense } from "react";
import { getAllProducts } from "@/app/actions/products";
import { getAllCategories } from "@/app/actions/categories";
import ProductCategoryTabs from "@/components/ProductCategoryTabs";
import WhyBuyFromUs from "@/components/WhyBuyFromUs";
import NewProducts from "@/components/NewProducts";
import Newsletter from "@/components/Newsletter";

// Revalidate la fiecare 60 de secunde pentru pagina home
export const revalidate = 60;

export default async function Home() {
  const { data: produse, error: productsError } = await getAllProducts();
  const { data: categorii, error: categoriesError } = await getAllCategories();

  if (productsError || !produse) {
    return (
      <div className="space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
          <h1 className="text-4xl font-semibold text-zinc-900">Produsele noastre</h1>
        </header>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-rose-800">{productsError || "Nu s-au putut încărca produsele."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Secțiunea Catalog */}
      <section>
        {produse.length === 0 ? (
          <>
            <header className="space-y-3 mb-8 lg:mb-10">
              <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Catalog</p>
              <h1 className="text-4xl font-semibold text-zinc-900">Produsele noastre</h1>
            </header>
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-12 text-center">
              <p className="text-lg font-semibold text-zinc-900">Nu există produse disponibile</p>
              <p className="mt-2 text-sm text-zinc-600">
                Produsele vor apărea aici când vor fi adăugate.
              </p>
            </div>
          </>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            </div>
          }>
            <ProductCategoryTabs 
              produse={produse} 
              categorii={categorii || []} 
            />
          </Suspense>
        )}
      </section>

      {/* Secțiunea Produse noi */}
      <NewProducts produse={produse} />

      {/* Secțiunea De ce să cumperi de la noi */}
      {/* <WhyBuyFromUs /> */}

      {/* Secțiunea Newsletter */}
      <Newsletter />
    </div>
  );
}
