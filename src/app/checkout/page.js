"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/app/actions/orders";
import { State, City } from "country-state-city";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcul cost livrare: 20 lei dacă subtotal <= 100, altfel gratuit
  const shippingCost = subtotal <= 100 ? 20 : 0;
  const total = subtotal + shippingCost;

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
    notes: "",
    paymentMethod: "ramburs",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Obține județele din România și filtrează intrările invalide
  const counties = useMemo(() => {
    const allStates = State.getStatesOfCountry("RO") || [];
    // Lista de județe valide din România (pentru verificare suplimentară)
    const validCounties = [
      "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
      "Brăila", "Brașov", "București", "Buzău", "Caraș-Severin", "Cluj", "Constanța",
      "Covasna", "Călărași", "Dolj", "Dâmbovița", "Galați", "Giurgiu", "Gorj",
      "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți",
      "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sibiu", "Suceava",
      "Sălaj", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vrancea", "Vâlcea"
    ];
    
    // Filtrează intrările invalide și sortează alfabetic
    const filtered = allStates
      .filter((state) => {
        if (!state || !state.name || typeof state.name !== "string") return false;
        const name = state.name.trim();
        const nameLower = name.toLowerCase();
        
        // Exclude explicit "country" și variante
        if (nameLower === "country" || nameLower.includes("country")) return false;
        
        // Verifică dacă este un județ valid (fie prin nume exact, fie prin conținut)
        const isCountyName = validCounties.some(valid => 
          nameLower.includes(valid.toLowerCase()) || 
          valid.toLowerCase().includes(nameLower.replace(" county", "").replace(" county", ""))
        );
        
        // Sau verifică dacă are isoCode valid (2 caractere pentru județe)
        const hasValidIsoCode = state.isoCode && state.isoCode.length >= 1 && state.isoCode.length <= 3;
        
        return name.length > 0 && (isCountyName || hasValidIsoCode);
      })
      .map(state => ({
        ...state,
        // Curăță numele de "County" dacă există
        name: state.name.replace(/\s*County\s*$/i, "").trim()
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "ro"));
    
    // Debug: verifică dacă există "country" în listă
    if (typeof window !== "undefined") {
      const hasCountry = filtered.some(c => c.name.toLowerCase().includes("country"));
      if (hasCountry) {
        console.warn("Atenție: Lista de județe conține 'country':", filtered.map(c => c.name));
      }
    }
    
    return filtered;
  }, []);
  
  // Obține orașele pentru județul selectat
  const cities = useMemo(() => {
    if (!formData.county) return [];
    const selectedCounty = counties.find(c => c.name === formData.county);
    if (!selectedCounty) return [];
    return City.getCitiesOfState("RO", selectedCounty.isoCode);
  }, [formData.county, counties]);

  // Funcții de validare
  const validateFullName = (name) => {
    if (!name || name.trim().length === 0) {
      return "Numele complet este obligatoriu";
    }
    if (name.trim().length < 2) {
      return "Numele trebuie să aibă minim 2 caractere";
    }
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return "Numărul de telefon este obligatoriu";
    }
    // Elimină spațiile și caracterele speciale
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    // Verifică formatul: 07XXXXXXXX (10 cifre, începe cu 07)
    if (cleanPhone.length < 10) {
      return "Numărul de telefon trebuie să aibă 10 cifre";
    }
    if (!/^07\d{8}$/.test(cleanPhone)) {
      return "Numărul de telefon trebuie să înceapă cu 07 și să aibă 10 cifre";
    }
    return null;
  };

  const validateAddress = (address) => {
    if (!address || address.trim().length === 0) {
      return "Adresa este obligatorie";
    }
    if (address.trim().length < 5) {
      return "Adresa trebuie să aibă minim 5 caractere";
    }
    return null;
  };

  const validateCounty = (county) => {
    if (!county || county.trim().length === 0) {
      return "Județul este obligatoriu";
    }
    const validCounty = counties.find(c => c.name === county);
    if (!validCounty) {
      return "Te rugăm să selectezi un județ valid";
    }
    return null;
  };

  const validateCity = (city) => {
    if (!city || city.trim().length === 0) {
      return "Localitatea este obligatorie";
    }
    if (formData.county) {
      const validCity = cities.find(c => c.name === city);
      if (!validCity && cities.length > 0) {
        return "Te rugăm să selectezi o localitate validă pentru județul ales";
      }
    }
    return null;
  };

  const validatePostalCode = (postalCode) => {
    if (!postalCode || postalCode.trim().length === 0) {
      return "Codul poștal este obligatoriu";
    }
    // Codul poștal românesc are 6 cifre, dar acceptăm și 4-6 cifre pentru flexibilitate
    const cleanPostalCode = postalCode.replace(/\s/g, "");
    if (!/^\d+$/.test(cleanPostalCode)) {
      return "Codul poștal trebuie să conțină doar cifre";
    }
    if (cleanPostalCode.length < 4) {
      return "Codul poștal trebuie să aibă minim 4 cifre";
    }
    if (cleanPostalCode.length > 6) {
      return "Codul poștal trebuie să aibă maxim 6 cifre";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return "Adresa de email este obligatorie";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Te rugăm să introduci o adresă de email validă";
    }
    return null;
  };

  // Validare completă a formularului
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      county: validateCounty(formData.county),
      city: validateCity(formData.city),
      postalCode: validatePostalCode(formData.postalCode),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== null);
  };

  // Redirect dacă coșul e gol
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cos");
    }
  }, [items.length, router]);

  // Dacă coșul e gol, nu renderiza conținutul
  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Marchează toate câmpurile ca fiind "touched"
    const allFields = Object.keys(formData);
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validează formularul
    if (!validateForm()) {
      setError("Te rugăm să completezi corect toate câmpurile obligatorii.");
      return;
    }

    // Verifică dacă metoda de plată este validă (nu permite card dacă este disabled)
    if (formData.paymentMethod === "card") {
      setError("Plata cu cardul nu este disponibilă momentan. Te rugăm să selectezi ramburs.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
          product_image: item.image || null,
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        email: formData.email.trim(),
        shipping_address: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.replace(/[\s\-\(\)]/g, ""),
          address: formData.address.trim(),
          city: formData.city.trim(),
          county: formData.county.trim(),
          postalCode: formData.postalCode.replace(/\s/g, ""),
        },
        notes: formData.notes.trim(),
        payment_method: formData.paymentMethod || "ramburs",
      };

      // Trimite userId dacă utilizatorul este autentificat
      const result = await createOrder(orderData, user?.id || null);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.data && result.data.id) {
        clearCart();
        // Redirect către pagina de success folosind window.location pentru a fi siguri că funcționează
        const orderId = result.data.id;
        console.log("Redirecting to success page with order ID:", orderId);
        
        // Folosim window.location.href pentru un redirect sigur
        window.location.href = `/comenzi/success/${orderId}`;
        } else {
        console.error("Order creation result:", result);
        setError("Comanda a fost creată, dar nu am putut obține ID-ul comenzii. Te rugăm să verifici comenzile tale.");
        setLoading(false);
      }
    } catch (err) {
      setError("A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Dacă se schimbă județul, resetează orașul și erorile
    if (name === "county") {
      setFormData(prev => ({
        ...prev,
        county: value,
        city: "",
      }));
      // Resetează eroarea pentru oraș când se schimbă județul
      setErrors(prev => ({
        ...prev,
        city: null,
      }));
    } else if (name === "phone") {
      // Formatează automat numărul de telefon
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length > 0 && cleaned[0] !== "0") {
        formatted = "0" + cleaned;
      }
      if (formatted.length > 10) {
        formatted = formatted.slice(0, 10);
      }
      // Adaugă spații pentru formatare: 07XX XXX XXX
      if (formatted.length > 4) {
        formatted = formatted.slice(0, 4) + " " + formatted.slice(4);
      }
      if (formatted.length > 8) {
        formatted = formatted.slice(0, 8) + " " + formatted.slice(8);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validează câmpul în timp real dacă a fost deja "touched"
    if (touched[name]) {
      let fieldError = null;
      switch (name) {
        case "fullName":
          fieldError = validateFullName(value);
          break;
        case "phone":
          fieldError = validatePhone(value);
          break;
        case "address":
          fieldError = validateAddress(value);
          break;
        case "county":
          fieldError = validateCounty(value);
          break;
        case "city":
          fieldError = validateCity(value);
          break;
        case "postalCode":
          fieldError = validatePostalCode(value);
          break;
        default:
          break;
      }
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validează câmpul la blur
    let fieldError = null;
    switch (name) {
      case "fullName":
        fieldError = validateFullName(value);
        break;
      case "email":
        fieldError = validateEmail(value);
        break;
      case "phone":
        fieldError = validatePhone(value);
        break;
      case "address":
        fieldError = validateAddress(value);
        break;
      case "county":
        fieldError = validateCounty(value);
        break;
      case "city":
        fieldError = validateCity(value);
        break;
      case "postalCode":
        fieldError = validatePostalCode(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
      <div>
        <header className="space-y-2 mb-4 lg:mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">Finalizează comanda</h1>
          <p className="text-zinc-600">Completează datele pentru livrare.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">Date de livrare</h2>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Nume complet *
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                  errors.fullName && touched.fullName
                    ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                    : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                }`}
                placeholder="Nume Prenume"
              />
              {errors.fullName && touched.fullName && (
                <span className="mt-1 text-xs text-rose-600">{errors.fullName}</span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Email *
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                  errors.email && touched.email
                    ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                    : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                }`}
                placeholder="email@exemplu.com"
              />
              {errors.email && touched.email && (
                <span className="mt-1 text-xs text-rose-600">{errors.email}</span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Telefon *
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                  errors.phone && touched.phone
                    ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                    : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                }`}
                placeholder="07XX XXX XXX"
              />
              {errors.phone && touched.phone && (
                <span className="mt-1 text-xs text-rose-600">{errors.phone}</span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Adresă *
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                  errors.address && touched.address
                    ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                    : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                }`}
                placeholder="Strada, număr, bloc, scară, apartament"
              />
              {errors.address && touched.address && (
                <span className="mt-1 text-xs text-rose-600">{errors.address}</span>
              )}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Județ *
                <select
                  name="county"
                  required
                  value={formData.county}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                    errors.county && touched.county
                      ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                      : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                  }`}
                >
                  <option value="">Selectează județul</option>
                  {counties.map((county) => (
                    <option key={county.isoCode} value={county.name}>
                      {county.name}
                    </option>
                  ))}
                </select>
                {errors.county && touched.county && (
                  <span className="mt-1 text-xs text-rose-600">{errors.county}</span>
                )}
              </label>

              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Localitate *
                <select
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!formData.county || cities.length === 0}
                  className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                    errors.city && touched.city
                      ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                      : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                  } ${!formData.county || cities.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {!formData.county
                      ? "Selectează mai întâi județul"
                      : cities.length === 0
                      ? "Nu există localități disponibile"
                      : "Selectează localitatea"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && touched.city && (
                  <span className="mt-1 text-xs text-rose-600">{errors.city}</span>
                )}
              </label>
            </div>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Cod poștal *
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => {
                  // Permite doar cifre, maxim 6
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setFormData(prev => ({
                    ...prev,
                    postalCode: value,
                  }));
                  // Validează în timp real dacă a fost touched
                  if (touched.postalCode) {
                    const fieldError = validatePostalCode(value);
                    setErrors(prev => ({
                      ...prev,
                      postalCode: fieldError,
                    }));
                  }
                }}
                onBlur={handleBlur}
                maxLength={6}
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm text-zinc-800 outline-none transition focus:bg-white ${
                  errors.postalCode && touched.postalCode
                    ? "border-rose-400 bg-rose-50/60 focus:border-rose-500"
                    : "border-zinc-200 bg-zinc-50/60 focus:border-emerald-500"
                }`}
                placeholder="123456"
              />
              {errors.postalCode && touched.postalCode && (
                <span className="mt-1 text-xs text-rose-600">{errors.postalCode}</span>
              )}
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Observații (opțional)
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white resize-none"
                placeholder="Instrucțiuni speciale pentru livrare..."
              />
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-200 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">Metodă de plată</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                formData.paymentMethod === "ramburs"
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-zinc-200 bg-zinc-50/60 hover:border-emerald-500 hover:bg-white"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ramburs"
                  checked={formData.paymentMethod === "ramburs"}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900">Ramburs</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">Plata se face la livrare</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  disabled
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900">Card bancar</span>
                    <span className="text-xs text-zinc-500 bg-zinc-200 px-2 py-1 rounded-full">În curând</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">Plata online cu cardul</p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Plasez comanda..." : "Plasează comanda"}
            </button>
          </div>
        </form>
      </div>

      <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-6 lg:sticky lg:top-24 lg:self-start h-fit">
        <h2 className="text-lg font-semibold text-zinc-900 lg:text-xl">Rezumat comandă</h2>
        <div className="mt-4 space-y-3 text-sm text-zinc-600 lg:mt-6">
          <div className="flex items-center justify-between">
            <span>Produse ({itemCount})</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Livrare</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600 font-semibold">Gratuit</span>
              ) : (
                `${shippingCost.toFixed(2)} lei`
              )}
            </span>
          </div>
          {subtotal < 100 && (
            <div className="text-xs text-emerald-600">
              Mai adaugă produse în valoare de {((100 - subtotal).toFixed(2))} lei și primești livrare gratuită
            </div>
          )}
        </div>
        <div className="mt-4 border-t border-zinc-100 pt-4 lg:mt-6">
          <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
            <span>Total</span>
            <span>{total.toFixed(2)} lei</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          {formData.paymentMethod === "ramburs" 
            ? "Plata se face exclusiv la livrare (ramburs). Vom confirma telefonic înainte de expediere."
            : "Plata cu cardul va fi disponibilă în curând."}
        </p>
        <Link href="/cos" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-500 lg:mt-6">
          ← Înapoi la coș
        </Link>
      </aside>
    </div>
  );
}

