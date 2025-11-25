-- Creează tabelul orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'nouă',
  payment_method TEXT NOT NULL DEFAULT 'ramburs',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creează index pentru user_id pentru performanță
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Creează index pentru created_at pentru sortare rapidă
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Activează Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Utilizatorii pot vedea doar comenzile lor
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Utilizatorii pot crea comenzi pentru ei înșiși
CREATE POLICY "Users can create their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Utilizatorii pot actualiza doar comenzile lor (opțional, pentru viitoare funcționalități)
CREATE POLICY "Users can update their own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Funcție pentru actualizarea automată a updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pentru actualizarea automată a updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarii pentru documentare
COMMENT ON TABLE public.orders IS 'Tabel pentru comenzile utilizatorilor';
COMMENT ON COLUMN public.orders.items IS 'Array JSON cu produsele comandate: [{"product_id": "...", "product_name": "...", "quantity": 1, "price": 100.00}]';
COMMENT ON COLUMN public.orders.shipping_address IS 'Obiect JSON cu adresa de livrare: {"fullName": "...", "phone": "...", "address": "...", "city": "...", "county": "...", "postalCode": "..."}';
COMMENT ON COLUMN public.orders.status IS 'Statusul comenzii: nouă, confirmată, expediată, livrată, anulată';

