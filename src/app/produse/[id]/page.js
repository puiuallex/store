import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import { getProductById, getAllProducts } from "@/app/actions/products";

export async function generateStaticParams() {
  const { data: produse } = await getAllProducts();
  if (!produse) {
    return [];
  }
  return produse.map((produs) => ({ id: produs.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: produs } = await getProductById(id);
  if (!produs) {
    return { title: "Produs indisponibil | Creating Layers" };
  }
  return {
    title: `${produs.nume} | Creating Layers`,
    description: produs.descriere,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { data: produs, error } = await getProductById(id);

  if (error || !produs) {
    notFound();
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <ProductImageGallery imagini={produs.imagini} nume={produs.nume} />
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">{produs.categorie}</p>
            {produs.personalizat && (
              <span className="rounded-full bg-purple-500/90 px-3 py-1 text-xs font-medium text-white shadow-sm">
                Personalizat
              </span>
            )}
          </div>
          <h1 className="text-4xl font-semibold text-zinc-900">{produs.nume}</h1>
          <p className="text-zinc-600">{produs.descriere}</p>
          {produs.personalizat && (
            <p className="text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
              Acest produs poate fi personalizat conform preferințelor tale. Click pe butonul de comandă pentru a discuta detaliile.
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {produs.pret_oferta ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold text-emerald-600">
                  {produs.pret_oferta} lei
                </span>
                <span className="text-2xl font-medium text-zinc-400 line-through">
                  {produs.pret} lei
                </span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">În ofertă</span>
            </div>
          ) : (
          <span className="text-4xl font-semibold text-zinc-900">{produs.pret} lei</span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-700">
          <DetailPill label="Disponibilitate" value={produs.stoc ? "În stoc" : "La comandă"} />
          <DetailPill label="Culori" value={produs.culori.join(", ")} />
        </div>
        <AddToCartButton produs={produs} size="lg" />
        <p className="text-xs text-zinc-500">
          Plata se face la livrare. Confirmăm telefonic înainte să expediem coletul.
        </p>
        <Link href="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
          ← Înapoi la catalog
        </Link>
      </div>
    </div>
  );
}

function DetailPill({ label, value }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">
      <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">{label}</span>
      <br />
      {value}
    </span>
  );
}

