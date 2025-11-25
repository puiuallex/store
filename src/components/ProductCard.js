import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ produs }) {
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

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.14)]">
      <Link href={`/produse/${id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          <Image
            src={imagine}
            alt={nume}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
          <div className="absolute inset-x-4 top-4 flex gap-2 text-xs font-medium z-10 flex-wrap">
            {noutate && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-zinc-800 shadow-sm">
                Nou
              </span>
            )}
            {personalizat && (
              <span className="rounded-full bg-purple-500/90 px-3 py-1 text-white shadow-sm">
                Personalizat
              </span>
            )}
            {!stoc && (
              <span className="rounded-full bg-amber-500/90 px-3 py-1 text-white shadow-sm">
                Precomandă
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-sm font-semibold text-zinc-900 bg-white/90 px-3 py-1.5 rounded-full shadow-sm z-10">
            {categorie}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <p className="text-xl font-semibold text-zinc-900 transition group-hover:text-emerald-600">
              {nume}
            </p>
            <p className="mt-2 text-sm text-zinc-600">{descriere}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm text-zinc-600">
            <div>
              <dt className="text-xs uppercase tracking-widest text-zinc-400">
                Culori
              </dt>
              <dd>{culori.join(", ")}</dd>
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
      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4">
        <div className="flex flex-col">
          {inOferta ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-emerald-600">{pret_oferta} lei</span>
                <span className="text-sm font-medium text-zinc-400 line-through">{pret} lei</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">În ofertă</span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-zinc-900">{pret} lei</span>
          )}
        </div>
        <AddToCartButton produs={produs} size="sm" />
      </div>
    </article>
  );
}

