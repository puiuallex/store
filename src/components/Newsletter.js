"use client";

import { useState } from "react";
import { EnvelopeIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    // Validare simplă
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Te rugăm să introduci un email valid.");
      return;
    }

    try {
      // Aici poți adăuga logica pentru salvarea email-ului
      // De exemplu, un API call sau server action
      // Pentru moment, simulăm un delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStatus("success");
      setMessage("Mulțumim! Te-ai abonat cu succes.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 lg:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
            <EnvelopeIcon className="h-8 w-8" />
          </div>
          <h2 className="mb-3 text-2xl lg:text-3xl font-semibold text-zinc-900">
            Abonează-te la newsletter
          </h2>
          <p className="mb-8 text-zinc-600">
            Primește oferte exclusive, noutăți despre produse și reduceri speciale direct în inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:max-w-md sm:mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresa ta de email"
              disabled={status === "loading" || status === "success"}
              className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              required
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                "Se abonează..."
              ) : status === "success" ? (
                <>
                  <CheckIcon className="mr-2 inline h-5 w-5" />
                  Abonat
                </>
              ) : (
                "Abonează-te"
              )}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "success" ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

