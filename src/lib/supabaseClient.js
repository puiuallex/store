import { createClient } from "@supabase/supabase-js";

function getCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || (!anonKey && !serviceKey)) {
    return null;
  }

  return {
    url,
    apiKey: serviceKey || anonKey,
    isService: Boolean(serviceKey),
  };
}

export function createServerSupabaseClient() {
  const creds = getCredentials();

  if (!creds) {
    return null;
  }

  return createClient(creds.url, creds.apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: creds.isService ? { "X-Client-Info": "store-service" } : {},
    },
  });
}

export function createBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    return null;
  }

  const creds = getCredentials();

  if (!creds || creds.isService) {
    return null;
  }

  return createClient(creds.url, creds.apiKey, {
    auth: { detectSessionInUrl: true },
  });
}

