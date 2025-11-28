export const metadata = {
  title: "Politica de confidențialitate | Creating Layers",
};

const policies = [
  {
    title: "Ce date colectăm",
    details:
      "Nume, email, telefon și adresă de livrare pentru a procesa comenzile. Opțional, salvăm preferințele tale de comunicare.",
  },
  {
    title: "Cum folosim datele",
    details:
      "Exclusiv pentru procesarea comenzilor, notificări legate de status și, dacă alegi, pentru comunicări promoționale punctuale.",
  },
  {
    title: "Stocare",
    details:
      "Datele sunt păstrate în Supabase (UE) cu acces restricționat. Păstrăm istoricul comenzilor pentru 24 de luni sau până la solicitarea ta de ștergere.",
  },
  {
    title: "Drepturile tale",
    details:
      "Ne poți cere oricând exportul, actualizarea sau ștergerea datelor personale. Scrie-ne la dpo@store.ro pentru orice solicitare.",
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <header className="space-y-2 mb-4 lg:mb-6">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Protecția datelor</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Politica de confidențialitate</h1>
        <p className="text-sm text-zinc-600">Te rugăm să citești cu atenție această secțiune.</p>
      </header>
      <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8">
        {policies.map((policy) => (
          <article key={policy.title}>
            <h2 className="text-xl font-semibold text-zinc-900">{policy.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{policy.details}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

