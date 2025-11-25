"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  return (
    <div className="mx-auto max-w-md">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
          <TabList className="mb-6 flex gap-2 rounded-2xl bg-zinc-100 p-1">
            <Tab className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 transition data-[selected]:bg-white data-[selected]:text-emerald-600 data-[selected]:shadow-sm">
              Autentificare
            </Tab>
            <Tab className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 transition data-[selected]:bg-white data-[selected]:text-emerald-600 data-[selected]:shadow-sm">
              Înregistrare
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <LoginForm signIn={signIn} router={router} />
            </TabPanel>
            <TabPanel>
              <RegisterForm signUp={signUp} router={router} onSuccess={() => setSelectedIndex(0)} />
            </TabPanel>
          </TabPanels>
        </div>
      </TabGroup>
    </div>
  );
}

function LoginForm({ signIn, router }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email sau parolă incorectă. Te rugăm să încerci din nou."
          : authError.message || "A apărut o eroare la autentificare."
      );
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Bine ai revenit</p>
        <h2 className="text-3xl font-semibold text-zinc-900">Autentificare</h2>
        <p className="text-sm text-zinc-600">
          Introdu datele contului tău pentru a continua comanda sau a urmări statusul.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
        )}
        <label className="flex flex-col text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder="nume@exemplu.ro"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-zinc-700">
          Parolă
          <input
            type="password"
            name="password"
            required
            className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Autentificare..." : "Intră în cont"}
        </button>
      </form>
    </div>
  );
}

function RegisterForm({ signUp, router, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.target);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const password = formData.get("password");

    if (password.length < 8) {
      setError("Parola trebuie să aibă minim 8 caractere.");
      setLoading(false);
      return;
    }

    const { error: authError } = await signUp(email, password, fullName);

    if (authError) {
      setError(
        authError.message === "User already registered"
          ? "Acest email este deja înregistrat. Te rugăm să te autentifici."
          : authError.message || "A apărut o eroare la înregistrare."
      );
      setLoading(false);
    } else {
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-600">Bun venit</p>
        <h2 className="text-3xl font-semibold text-zinc-900">Creează un cont</h2>
        <p className="text-sm text-zinc-600">
          Salvează adrese, urmărește comenzile și primește notificări personalizate.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
        )}
        {success && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Cont creat cu succes! Te redirecționăm...
          </div>
        )}
        <label className="flex flex-col text-sm font-medium text-zinc-700">
          Nume complet
          <input
            type="text"
            name="fullName"
            required
            className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder="Numele tău"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder="nume@exemplu.ro"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-zinc-700">
          Parolă
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder="Minim 8 caractere"
          />
        </label>
        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creăm contul..." : "Înregistrează-te"}
        </button>
      </form>
    </div>
  );
}

