import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ produs, noShadow = false, hideNewBadge = false }) {
  const {
    nume,
    descriere,
    pret,
    pret_oferta,
    categorie,
    culori,
    imagine,
    noutate,
    stoc,
    personalizat,
    id,
  } = produs;

  const pretFinal = pret_oferta || pret;
  const inOferta = pret_oferta !== null && pret_oferta < pret;
  const discountPercentage = inOferta ? Math.round(((pret - pret_oferta) / pret) * 100) : 0;

  return (
    <article className={`flex flex-col h-full overflow-hidden rounded-2xl lg:rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur transition hover:-translate-y-1 ${
      noShadow 
        ? "" 
        : "shadow-sm lg:shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_70px_rgba(15,23,42,0.14)]"
    }`}>
      <Link href={`/produse/${id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-square lg:aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          <Image
            src={imagine}
            alt={nume}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 50vw"
            loading="lazy"
          />
          <div className="absolute inset-x-2 top-2 lg:inset-x-3 lg:top-3 flex gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-medium z-10 flex-wrap">
            {inOferta && (
              <span className="rounded-full bg-red-500/90 px-2 py-0.5 lg:px-2.5 lg:py-1 text-white shadow-sm font-bold">
                -{discountPercentage}%
              </span>
            )}
            {noutate && !hideNewBadge && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 lg:px-2.5 lg:py-1 text-zinc-800 shadow-sm hidden lg:inline-block">
                Nou
              </span>
            )}
            {personalizat && (
              <span className="rounded-full bg-purple-500/90 px-2 py-0.5 lg:px-2.5 lg:py-1 text-white shadow-sm hidden lg:inline-block">
                Personalizat
              </span>
            )}
            {!stoc && (
              <span className="rounded-full bg-amber-500/90 px-2 py-0.5 lg:px-2.5 lg:py-1 text-white shadow-sm text-[9px] lg:text-xs">
                Precomandă
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 lg:gap-2 p-2.5 lg:p-3">
          <div>
            <p className="text-sm lg:text-base font-semibold text-zinc-900 transition group-hover:text-emerald-600 line-clamp-2">
              {nume}
            </p>
          </div>
          <dl className="hidden lg:grid grid-cols-2 gap-2 text-xs text-zinc-600">
            <div>
              <dt className="text-xs uppercase tracking-widest text-zinc-400">
                Culori
              </dt>
              <dd>
                {culori && culori.length > 0
                  ? culori
                      .filter((c) => c != null)
                      .map((c) => (typeof c === "string" ? c : c?.nume || ""))
                      .filter((n) => n)
                      .join(", ")
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-zinc-400">
                Disponibilitate
              </dt>
              <dd>{stoc ? "În stoc" : "La comandă"}</dd>
            </div>
          </dl>
        </div>
      </Link>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1.5 lg:gap-2 border-t border-zinc-100 px-2.5 py-2 lg:px-3 lg:py-2.5">
        <div className="flex flex-col min-w-0 flex-1">
          {inOferta ? (
            <>
              <div className="flex items-center gap-1 lg:gap-1.5">
                <span className="text-sm lg:text-lg font-semibold text-emerald-600">{pret_oferta} lei</span>
                <span className="text-[9px] lg:text-xs font-medium text-zinc-400 line-through">{pret} lei</span>
              </div>
              <span className="text-[8px] lg:text-[10px] font-semibold text-emerald-600 hidden lg:inline">În ofertă</span>
            </>
          ) : (
            <span className="text-sm lg:text-lg font-semibold text-zinc-900">{pret} lei</span>
          )}
        </div>
        <div className="w-full lg:w-auto">
        <AddToCartButton produs={produs} size="sm" />
        </div>
      </div>
    </article>
  );
}

