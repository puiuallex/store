-- Creează tabelul de legătură pentru relația many-to-many între products și categories
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, category_id)
);

-- Creează indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON public.product_categories(category_id);

-- Activează Row Level Security
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Toți pot vedea legăturile (public read)
CREATE POLICY "Product categories are viewable by everyone"
  ON public.product_categories
  FOR SELECT
  USING (true);

-- Policy: Doar adminii pot crea legături
CREATE POLICY "Admins can create product categories"
  ON public.product_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policy: Doar adminii pot actualiza legături
CREATE POLICY "Admins can update product categories"
  ON public.product_categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policy: Doar adminii pot șterge legături
CREATE POLICY "Admins can delete product categories"
  ON public.product_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Migrează datele existente din coloana categorie în noua tabelă de legătură
-- Găsește categoria după nume și creează legătura
INSERT INTO public.product_categories (product_id, category_id)
SELECT 
  p.id as product_id,
  c.id as category_id
FROM public.products p
INNER JOIN public.categories c ON c.nume = p.categorie
WHERE p.categorie IS NOT NULL AND p.categorie != ''
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Face coloana categorie nullable (o vom elimina ulterior, dar păstrăm pentru compatibilitate temporară)
ALTER TABLE public.products 
  ALTER COLUMN categorie DROP NOT NULL;

-- Comentarii pentru documentare
COMMENT ON TABLE public.product_categories IS 'Tabel de legătură many-to-many între products și categories';
COMMENT ON COLUMN public.product_categories.product_id IS 'ID-ul produsului';
COMMENT ON COLUMN public.product_categories.category_id IS 'ID-ul categoriei';

