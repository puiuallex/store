export const metadata = {
  title: "Termeni și condiții | Creating Layers",
};

const sections = [
  {
    title: "Comenzi",
    content:
      "Toate comenzile sunt procesate după confirmarea telefonică. Ne rezervăm dreptul de a refuza comenzi atunci când stocul este limitat sau datele de contact nu pot fi verificate.",
  },
  {
    title: "Plată",
    content:
      "Plata se face exclusiv la livrare (ramburs). În viitor vom adăuga opțiuni cu cardul, fără a modifica prețurile existente.",
  },
  {
    title: "Livrare",
    content:
      "Expediem prin curier rapid în 24-48h în funcție de volum. Costul exact este comunicat în momentul confirmării și adăugat pe factura finală.",
  },
  {
    title: "Retur",
    content:
      "Produsele personalizate pot fi returnate doar în cazul unor defecte vizibile. Notifică-ne în primele 48h de la recepție pentru soluționare.",
  },
];

export default function TermsPage() {
  return (
    <div>
      <header className="space-y-2 mb-4 lg:mb-6">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Legal</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Termeni și condiții</h1>
        <p className="text-sm text-zinc-600">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
      </header>
      <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="text-xl font-semibold text-zinc-900">{section.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{section.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

