-- Modifică tabelul products pentru a suporta multiple imagini
-- Schimbă coloana imagine din TEXT în TEXT[] (array de imagini)

-- Adaugă coloana nouă pentru imagini multiple
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS imagini TEXT[] DEFAULT '{}';

-- Face coloana imagine nullable (pentru a permite migrarea graduală)
ALTER TABLE public.products 
  ALTER COLUMN imagine DROP NOT NULL;

-- Migrează datele existente: copiază imagine în imagini[0]
UPDATE public.products 
SET imagini = ARRAY[imagine] 
WHERE imagine IS NOT NULL AND (imagini IS NULL OR array_length(imagini, 1) IS NULL);

-- Comentariu actualizat
COMMENT ON COLUMN public.products.imagini IS 'Array de URL-uri pentru imagini produs';
COMMENT ON COLUMN public.products.imagine IS 'DEPRECATED: Folosește coloana imagini în loc. Se va elimina în viitor.';

