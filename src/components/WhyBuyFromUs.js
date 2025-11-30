import { TruckIcon, ShieldCheckIcon, SparklesIcon, HeartIcon } from "@heroicons/react/24/outline";

const benefits = [
  {
    icon: TruckIcon,
    title: "Livrare gratuită",
    description: "Livrare gratuită pentru comenzi peste 100 lei în toată țara",
  },
  {
    icon: ShieldCheckIcon,
    title: "Produse românești",
    description: "Produse de calitate, realizate în România cu pasiune și atenție la detalii",
  },
  {
    icon: SparklesIcon,
    title: "Personalizare",
    description: "Multe produse pot fi personalizate conform preferințelor tale",
  },
  {
    icon: HeartIcon,
    title: "Suport dedicat",
    description: "Echipa noastră este aici să te ajute la fiecare pas",
  },
];

export default function WhyBuyFromUs() {
  return (
    <section className="py-12 lg:py-16">
      <div className="text-center mb-10 lg:mb-12">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-2">Beneficii</p>
        <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900">
          De ce să cumperi de la noi?
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">{benefit.title}</h3>
              <p className="text-sm text-zinc-600">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}





