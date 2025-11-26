export default function ShippingBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-2.5 text-center text-xs font-medium sm:text-sm lg:px-8">
        <svg
          className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Livrare gratuită la comenzi peste 100 lei</span>
      </div>
    </div>
  );
}

