-- Adaugă câmpul personalizat în tabelul products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS personalizat BOOLEAN NOT NULL DEFAULT false;

-- Creează index pentru performanță
CREATE INDEX IF NOT EXISTS idx_products_personalizat ON public.products(personalizat);

-- Comentariu pentru documentare
COMMENT ON COLUMN public.products.personalizat IS 'Dacă produsul poate fi personalizat (true) sau nu (false)';

