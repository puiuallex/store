import Link from "next/link";

const footerLinks = [
  { title: "Informații", items: [{ label: "Livrare și retururi", href: "/livrare" }, { label: "Contact", href: "/contact" }] },
  { title: "Contul tău", items: [{ label: "Autentificare / Înregistrare", href: "/autentificare" }] },
  { title: "Legal", items: [{ label: "Termeni", href: "/termeni" }, { label: "Confidențialitate", href: "/confidentialitate" }] },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:justify-between lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-zinc-900 font-[family-name:var(--font-orbitron)] tracking-tight">creatinglayers.ro</p>
          <p className="text-sm text-zinc-500">
            Magazin online cu produse românești - livrare rapidă și plată ramburs.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 text-sm text-zinc-600 sm:grid-cols-3">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                {section.title}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-emerald-600">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} creatinglayers.ro — toate drepturile rezervate.
      </div>
    </footer>
  );
}

