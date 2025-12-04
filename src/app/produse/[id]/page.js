import Link from "next/link";
import { notFound } from "next/navigation";
import ProductColorSelector from "@/components/ProductColorSelector";
import ProductImageGallery from "@/components/ProductImageGallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedProducts from "@/components/RelatedProducts";
import ProductDescription from "@/components/ProductDescription";
import ProductShare from "@/components/ProductShare";
import NewProducts from "@/components/NewProducts";
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
  
  const imageUrl = produs.imagini?.[0] || produs.imagine;
  const fullImageUrl = imageUrl && imageUrl.startsWith('http') 
    ? imageUrl 
    : imageUrl 
      ? `https://creatinglayers.ro${imageUrl}`
      : 'https://creatinglayers.ro/og-image.jpg';
  
  return {
    title: `${produs.nume} | Creating Layers`,
    description: produs.descriere,
    alternates: {
      canonical: `/produse/${id}`,
    },
    openGraph: {
      title: `${produs.nume} | Creating Layers`,
      description: produs.descriere,
      images: [{
        url: fullImageUrl,
        alt: `${produs.nume} - Creating Layers`,
        width: 1200,
        height: 630,
      }],
      type: "website",
      url: `https://creatinglayers.ro/produse/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${produs.nume} | Creating Layers`,
      description: produs.descriere,
      images: [{
        url: fullImageUrl,
        alt: `${produs.nume} - Creating Layers`,
      }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { data: produs, error } = await getProductById(id);

  if (error || !produs) {
    notFound();
  }

  // Obține toate produsele pentru produse similare și produse noi
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

  // Structured Data (Schema.org) pentru produs
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": produs.nume,
    "description": produs.descriere,
    "image": produs.imagini && produs.imagini.length > 0 
      ? produs.imagini.map((img, index) => {
          const fullUrl = img.startsWith('http') ? img : `https://creatinglayers.ro${img}`;
          return {
            "@type": "ImageObject",
            "url": fullUrl,
            "name": `${produs.nume}${produs.imagini.length > 1 ? ` - Imagine ${index + 1}` : ''}`,
            "caption": `${produs.nume}${produs.imagini.length > 1 ? ` - Imagine ${index + 1}` : ''}`
          };
        })
      : (produs.imagine ? [{
          "@type": "ImageObject",
          "url": produs.imagine.startsWith('http') ? produs.imagine : `https://creatinglayers.ro${produs.imagine}`,
          "name": produs.nume,
          "caption": produs.nume
        }] : []),
    "offers": {
      "@type": "Offer",
      "url": `https://creatinglayers.ro/produse/${produs.id}`,
      "priceCurrency": "RON",
      "price": produs.pret_oferta || produs.pret,
      "availability": produs.stoc 
        ? "https://schema.org/InStock" 
        : "https://schema.org/PreOrder",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "RO",
        "returnPolicyCategory": produs.personalizat 
          ? "https://schema.org/MerchantReturnNotPermitted" 
          : "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": produs.personalizat ? undefined : 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "currency": "RON",
          "value": (produs.pret_oferta || produs.pret) <= 100 ? "20" : "0"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "RO"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          }
        }
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Creating Layers"
    },
    "category": produs.categorii && produs.categorii.length > 0 
      ? produs.categorii[0] 
      : (produs.categorie || ""),
    "sku": produs.id
  };

  // BreadcrumbList structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://creatinglayers.ro"
      },
      ...(produs.categorii && produs.categorii.length > 0
        ? [{
            "@type": "ListItem",
            "position": 2,
            "name": produs.categorii[0],
            "item": `https://creatinglayers.ro/?categorie=${encodeURIComponent(produs.categorii[0])}`
          }]
        : produs.categorie
        ? [{
            "@type": "ListItem",
            "position": 2,
            "name": produs.categorie,
            "item": `https://creatinglayers.ro/?categorie=${encodeURIComponent(produs.categorie)}`
          }]
        : []),
      {
        "@type": "ListItem",
        "position": produs.categorii && produs.categorii.length > 0 ? 3 : (produs.categorie ? 3 : 2),
        "name": produs.nume,
        "item": `https://creatinglayers.ro/produse/${produs.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
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
        {/* Indicator disponibilitate */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              produs.stoc ? "bg-emerald-500" : "bg-amber-500"
            }`}
            title={produs.stoc ? "În stoc" : "La comandă"}
          />
          <span className="text-xs lg:text-sm text-zinc-600">
            {produs.stoc ? "În stoc" : "La comandă"}
          </span>
        </div>
        <div className="w-full lg:w-auto">
          <ProductColorSelector produs={produs} />
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
        <ProductShare 
          productName={produs.nume}
          productUrl={`/produse/${produs.id}`}
          productImage={produs.imagine}
        />
        <p className="text-[10px] lg:text-xs text-zinc-500 leading-relaxed">
          Plata se face la livrare. Confirmăm telefonic sau prin mesaj înainte să expediem coletul.
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

      {/* Produse noi */}
      <NewProducts produse={allProducts || []} excludeProductId={produs.id} />
      </div>
    </>
  );
}


