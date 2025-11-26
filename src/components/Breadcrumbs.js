import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  // Pe mobile, afișează doar primul și ultimul element
  const mobileItems = items.length > 3 
    ? [items[0], { label: "...", href: null }, items[items.length - 1]]
    : items;

  return (
    <nav className="mb-6">
      {/* Desktop: afișează toate elementele */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-zinc-600">
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
      </div>

      {/* Mobile: afișează doar primul și ultimul element */}
      <div className="flex lg:hidden items-center gap-2 text-xs text-zinc-600">
        {mobileItems.map((item, index) => {
          const isLast = index === mobileItems.length - 1;
          
          return (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-emerald-600 transition truncate max-w-[100px]"
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : item.label === "..." ? (
                <span className="text-zinc-400">...</span>
              ) : (
                <span 
                  className={`${isLast ? "text-zinc-900 font-semibold" : ""} truncate max-w-[120px]`}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRightIcon className="h-3 w-3 text-zinc-400 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

