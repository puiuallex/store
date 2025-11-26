import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-emerald-600 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-zinc-900 font-semibold" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRightIcon className="h-4 w-4 text-zinc-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

