## Creating Layers — magazin online construit cu Next.js & Supabase

Funcționalități principale:

- Pagini dedicate: acasă (catalog integrat), pagină produs, coș, autentificare, înregistrare, contact, despre, termeni, confidențialitate
- Context global pentru coș și butoane „Adaugă în coș”
- Header sticky cu navigație modernă și badge pentru coș
- Formulare de login/register pregătite pentru integrarea Supabase Auth
- Toate textele în limba română, fără referințe la tehnologia de fabricație

### Integrare Supabase

Adaugă într-un `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Aceste variabile sunt folosite pentru autentificare, gestiunea comenzilor și analytics.

### Integrare Google Analytics (opțional)

Pentru analize avansate, adaugă în `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Fără această variabilă, aplicația va funcționa normal, dar Google Analytics nu va fi activat.

### Scripturi utile

- `npm run dev` – pornește aplicația pe `http://localhost:3000`
- `npm run lint` – rulează ESLint
- `npm run build` / `npm run start` – pregătește deploy-ul

### Analytics

Aplicația include un sistem complet de tracking:

- **Tracking propriu**: Vizualizări pagini, evenimente (adăugări în coș, checkout, comenzi), vizitatori unici
- **Dashboard analytics**: Accesibil din `/admin/analytics` cu metrici detaliate
- **Google Analytics**: Integrare opțională pentru analize avansate

Evenimente trackate:
- Vizualizări pagini (automat)
- Vizualizări produse
- Adăugări în coș
- Start checkout
- Comenzi finalizate
