# Migrații Supabase

Acest folder conține migrațiile SQL pentru baza de date Supabase.

## Cum să rulezi migrațiile

### Opțiunea 1: Supabase Dashboard (Recomandat)

1. Deschide [Supabase Dashboard](https://app.supabase.com)
2. Selectează proiectul tău
3. Mergi la **SQL Editor**
4. Copiază conținutul din `migrations/001_create_orders_table.sql`
5. Rulează query-ul

### Opțiunea 2: Supabase CLI

Dacă ai instalat Supabase CLI:

```bash
# Link proiectul local cu proiectul Supabase
supabase link --project-ref your-project-ref

# Rulează migrațiile
supabase db push
```

## Structura tabelului orders

- `id` - UUID, cheie primară
- `user_id` - UUID, referință către auth.users
- `items` - JSONB, array cu produsele comandate
- `subtotal` - NUMERIC, subtotalul comenzii
- `total` - NUMERIC, totalul final (inclusiv livrare)
- `shipping_address` - JSONB, adresa de livrare
- `notes` - TEXT, observații opționale
- `status` - TEXT, statusul comenzii (nouă, confirmată, expediată, etc.)
- `payment_method` - TEXT, metoda de plată (ramburs, card, etc.)
- `created_at` - TIMESTAMP, data creării
- `updated_at` - TIMESTAMP, data ultimei actualizări

## Securitate

Tabelul are Row Level Security (RLS) activat:
- Utilizatorii pot vedea doar comenzile lor
- Utilizatorii pot crea comenzi doar pentru ei înșiși
- Utilizatorii pot actualiza doar comenzile lor


