-- Elimină câmpurile timp_productie și materiale din tabelul products
-- Adaugă câmpul pret_oferta pentru prețuri reduse/oferte

-- Elimină coloana timp_productie
ALTER TABLE public.products 
  DROP COLUMN IF EXISTS timp_productie;

-- Elimină coloana materiale
ALTER TABLE public.products 
  DROP COLUMN IF EXISTS materiale;

-- Adaugă coloana pret_oferta (opțional, NULL înseamnă că nu e în ofertă)
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS pret_oferta NUMERIC(10, 2);

-- Comentariu pentru noul câmp
COMMENT ON COLUMN public.products.pret_oferta IS 'Preț redus/ofertă (NULL dacă produsul nu este în ofertă)';

