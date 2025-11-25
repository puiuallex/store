"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      // Folosim setTimeout pentru a evita setState sincron în effect
      setTimeout(() => setLoading(false), 0);
      return;
    }

    let mounted = true;

    // Verifică sesiunea inițială
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Ascultă schimbările de autentificare
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email, password) => {
    if (!supabase) {
      return { error: { message: "Supabase nu este configurat" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      router.push("/");
      router.refresh();
    }

    return { data, error };
  };

  const signUp = async (email, password, fullName) => {
    if (!supabase) {
      return { error: { message: "Supabase nu este configurat" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error && data.user) {
      router.push("/");
      router.refresh();
    }

    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth trebuie folosit în interiorul AuthProvider");
  }
  return context;
}

