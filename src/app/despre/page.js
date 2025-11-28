export const metadata = {
  title: "Despre noi | Creating Layers",
  description: "Află mai multe despre Creating Layers, magazinul tău de încredere pentru produse de calitate.",
};

const valori = [
  {
    titlu: "Calitate superioară",
    descriere: "Fiecare produs este selectat și verificat cu atenție pentru a ne asigura că îndeplinește standardele noastre ridicate de calitate.",
  },
  {
    titlu: "Livrare rapidă",
    descriere: "Procesăm comenzile rapid și livrăm în toată țara, astfel încât să primești produsele tale cât mai curând.",
  },
  {
    titlu: "Suport clienți dedicat",
    descriere: "Echipa noastră este aici să te ajute cu orice întrebări sau solicitări. Răspundem prompt și cu profesionalism.",
  },
  {
    titlu: "Plată sigură",
    descriere: "Oferim opțiuni de plată flexibile, inclusiv plata la livrare, pentru o experiență de cumpărare fără griji.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Despre noi</p>
        <h1 className="text-3xl font-semibold text-zinc-900 lg:text-4xl">Creating Layers</h1>
        <p className="max-w-3xl text-lg text-zinc-600">
          Creating Layers este un magazin online dedicat oferirii de produse de calitate superioară către clienții noștri din România. Ne străduim să oferim o experiență de cumpărare plăcută, transparentă și sigură.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Misiunea noastră</h2>
        <p className="max-w-3xl text-zinc-600">
          Misiunea noastră este să aducem clienților noștri produse de calitate, la prețuri accesibile, cu un serviciu de livrare rapid și sigur. Ne concentrăm pe satisfacerea clienților și pe construirea unei relații de încredere pe termen lung.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Valorile noastre</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {valori.map((valoare) => (
            <article
              key={valoare.titlu}
              className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-xl font-semibold text-zinc-900">{valoare.titlu}</h3>
              <p className="mt-2 text-zinc-600">{valoare.descriere}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Cum lucrăm</h2>
        <div className="space-y-4 text-zinc-600">
          <p>
            La Creating Layers, procesăm fiecare comandă cu atenție și profesionalism. După ce plasezi o comandă, o confirmăm telefonic pentru a ne asigura că toate detaliile sunt corecte. Apoi, procesăm comanda și o livrăm în cel mai scurt timp posibil.
          </p>
          <p>
            Oferim plata la livrare pentru comoditatea ta, iar în viitor vom adăuga și opțiunea de plată cu cardul online. Toate comenzile sunt procesate cu confidențialitate și respect pentru datele tale personale.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8">
        <h2 className="text-2xl font-semibold text-zinc-900">Contactează-ne</h2>
        <p className="mt-4 text-zinc-600">
          Ai întrebări sau ai nevoie de asistență? Nu ezita să ne contactezi. Suntem aici să te ajutăm și să răspundem la orice solicitări ai putea avea.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Vezi pagina de contact
        </a>
      </section>
    </div>
  );
}

