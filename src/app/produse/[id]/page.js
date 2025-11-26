import Link from "next/link";
import { notFound } from "next/navigation";
import ProductColorSelector from "@/components/ProductColorSelector";
import ProductImageGallery from "@/components/ProductImageGallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedProducts from "@/components/RelatedProducts";
import ProductDescription from "@/components/ProductDescription";
import ProductShare from "@/components/ProductShare";
import { getProductById, getAllProducts } from "@/app/actions/products";

// Revalidate la fiecare 5 minute pentru paginile de produse
export const revalidate = 300;

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

  // Obține toate produsele pentru produse similare
  const { data: allProducts } = await getAllProducts();
  
  // Filtrează produsele din aceeași categorie pentru produse similare
  const relatedProducts = allProducts?.filter((p) => {
    // Verifică dacă au cel puțin o categorie comună
    if (produs.categorii && produs.categorii.length > 0 && p.categorii && p.categorii.length > 0) {
      return p.categorii.some((cat) => produs.categorii.includes(cat));
    }
    // Fallback la categoria veche dacă nu există categorii multiple
    return p.categorie === produs.categorie && p.id !== produs.id;
  }) || [];

  // Construiește breadcrumbs
  const breadcrumbs = [
    { label: "Acasă", href: "/" },
    ...(produs.categorii && produs.categorii.length > 0
      ? [{ label: produs.categorii[0], href: `/?categorie=${encodeURIComponent(produs.categorii[0])}` }]
      : produs.categorie
      ? [{ label: produs.categorie, href: `/?categorie=${encodeURIComponent(produs.categorie)}` }]
      : []),
    { label: produs.nume },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid gap-6 lg:gap-12 lg:grid-cols-2">
      <ProductImageGallery imagini={produs.imagini} nume={produs.nume} />
      <div className="space-y-4 lg:space-y-6">
        <div className="space-y-2 lg:space-y-3">
          <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
            {(produs.categorii && produs.categorii.length > 0 ? produs.categorii : [produs.categorie]).map((cat, index) => (
              <p key={index} className="text-[10px] lg:text-xs uppercase tracking-[0.5em] text-emerald-600">{cat}</p>
            ))}
            {produs.personalizat && (
              <span className="rounded-full bg-purple-500/90 px-2.5 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs font-medium text-white shadow-sm">
                Personalizat
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-4xl font-semibold text-zinc-900">{produs.nume}</h1>
          <ProductDescription descriere={produs.descriere} />
          {produs.personalizat && (
            <p className="text-xs lg:text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 lg:py-3">
              Acest produs poate fi personalizat conform preferințelor tale. Click pe butonul de comandă pentru a discuta detaliile.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm text-zinc-700">
          <DetailPill label="Disponibilitate" value={produs.stoc ? "În stoc" : "La comandă"} />
          {produs.culori && produs.culori.length > 0 && (
            <DetailPill label="Culori" value={produs.culori.join(", ")} />
          )}
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          {produs.pret_oferta ? (
            <div className="flex flex-col gap-1.5 lg:gap-2">
              <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                <span className="text-2xl lg:text-4xl font-semibold text-emerald-600">
                  {produs.pret_oferta} lei
                </span>
                <span className="text-lg lg:text-2xl font-medium text-zinc-400 line-through">
                  {produs.pret} lei
                </span>
              </div>
              <span className="text-xs lg:text-sm font-semibold text-emerald-600">În ofertă</span>
            </div>
          ) : (
            <span className="text-2xl lg:text-4xl font-semibold text-zinc-900">{produs.pret} lei</span>
          )}
        </div>
        <div className="w-full lg:w-auto">
          <ProductColorSelector produs={produs} />
        </div>
        <ProductShare 
          productName={produs.nume}
          productUrl={`/produse/${produs.id}`}
          productImage={produs.imagine}
        />
        <p className="text-[10px] lg:text-xs text-zinc-500 leading-relaxed">
          Plata se face la livrare. Confirmăm telefonic înainte să expediem coletul.
        </p>
        <Link href="/" className="text-xs lg:text-sm font-semibold text-emerald-600 hover:text-emerald-500 inline-block">
          ← Înapoi la catalog
        </Link>
      </div>
      </div>
      
      {/* Produse similare */}
      {relatedProducts.length > 0 && (
        <RelatedProducts 
          produse={relatedProducts} 
          currentProductId={produs.id}
        />
      )}
    </div>
  );
}

function DetailPill({ label, value }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 lg:px-4 lg:py-2">
      <span className="text-[10px] lg:text-xs uppercase tracking-[0.3em] text-zinc-400">{label}</span>
      <br />
      <span className="text-xs lg:text-sm">{value}</span>
    </span>
  );
}

