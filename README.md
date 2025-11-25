## Creating Layers — magazin online construit cu Next.js & Supabase

Funcționalități principale:

- Pagini dedicate: acasă (catalog integrat), pagină produs, coș, autentificare, înregistrare, contact, despre, termeni, confidențialitate
- Context global pentru coș și butoane „Adaugă în coș”
- Header sticky cu navigație modernă și badge pentru coș
- Formulare de login/register pregătite pentru integrarea Supabase Auth
- Toate textele în limba română, fără referințe la tehnologia de fabricație

### Integrare Supabase (opțional)

Când ești gata să conectezi backend-ul, adaugă într-un `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Aceste variabile vor fi folosite pentru autentificare și viitoarele servicii de gestiune a comenzilor.

### Scripturi utile

- `npm run dev` – pornește aplicația pe `http://localhost:3000`
- `npm run lint` – rulează ESLint
- `npm run build` / `npm run start` – pregătește deploy-ul

### Următorii pași

- Conectează formularul de autentificare/înregistrare la Supabase Auth
- Adaugă procesator de plăți cu cardul (Stripe/EuPlătesc)
- Creează un panou intern pentru administrarea produselor și comenzilor
