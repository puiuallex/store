import Link from "next/link";

export const metadata = {
  title: "Livrare și retururi | Creating Layers",
  description: "Informații despre livrare și retururi pentru produsele Creating Layers",
};

export default function LivrarePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="space-y-3 mb-4 lg:mb-6">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Informații</p>
        <h1 className="text-3xl font-semibold text-zinc-900 lg:text-4xl">Livrare și retururi</h1>
      </header>

      <div className="space-y-8">
        {/* Secțiunea Livrare */}
        <section className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900">Livrare</h2>
          <div className="space-y-4 text-zinc-700">
            <p>
              Livrarea este disponibilă prin curier în toată țara. Coletul va fi livrat la adresa 
              indicată în comandă.
            </p>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
              <p className="font-semibold text-emerald-900 mb-2">Livrare gratuită</p>
              <p className="text-emerald-800">
                Livrarea este gratuită pentru comenzi de peste 100 de lei. Pentru comenzi sub 100 de lei, 
                costul de livrare este de 20 de lei.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-zinc-900">Proces de livrare:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Confirmăm comanda telefonic înainte de expediere</li>
                <li>Coletul este expediat prin curier</li>
                <li>Vei primi un telefon când coletul ajunge la tine</li>
                <li>Plata se face la livrare (ramburs)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Secțiunea Retururi */}
        <section className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900">Retururi</h2>
          <div className="space-y-4 text-zinc-700">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
              <p className="font-semibold text-amber-900 mb-2">Produse personalizate</p>
              <p className="text-amber-800">
                Returul pentru produsele personalizate nu este posibil, deoarece acestea sunt 
                realizate conform specificațiilor tale.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-zinc-900">Pentru produsele nepersonalizate:</p>
              <p>
                Dacă produsul nu corespunde așteptărilor tale, te rugăm să ne contactezi în termen de 
                14 zile de la primirea coletului pentru a discuta returnarea.
              </p>
            </div>
          </div>
        </section>

        {/* Link către contact */}
        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-6 text-center">
          <p className="text-zinc-700 mb-4">
            Ai întrebări despre livrare sau retururi?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Contactează-ne
          </Link>
        </div>
      </div>
    </div>
  );
}

