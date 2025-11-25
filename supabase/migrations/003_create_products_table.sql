-- Creează tabelul products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  nume TEXT NOT NULL,
  descriere TEXT NOT NULL,
  pret NUMERIC(10, 2) NOT NULL,
  timp_productie TEXT NOT NULL,
  categorie TEXT NOT NULL,
  culori TEXT[] NOT NULL DEFAULT '{}',
  materiale TEXT[] NOT NULL DEFAULT '{}',
  imagine TEXT NOT NULL,
  noutate BOOLEAN NOT NULL DEFAULT false,
  stoc BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creează indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_products_categorie ON public.products(categorie);
CREATE INDEX IF NOT EXISTS idx_products_stoc ON public.products(stoc);
CREATE INDEX IF NOT EXISTS idx_products_noutate ON public.products(noutate);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Activează Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Toți pot vedea produsele (public read)
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (true);

-- Funcție pentru actualizarea automată a updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pentru actualizarea automată a updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at_column();

-- Comentarii pentru documentare
COMMENT ON TABLE public.products IS 'Tabel pentru produsele magazinului';
COMMENT ON COLUMN public.products.id IS 'ID unic al produsului (slug)';
COMMENT ON COLUMN public.products.culori IS 'Array de culori disponibile pentru produs';
COMMENT ON COLUMN public.products.materiale IS 'Array de materiale folosite pentru produs';
COMMENT ON COLUMN public.products.stoc IS 'Dacă produsul este în stoc (true) sau la comandă (false)';

