-- Actualizează tabelul orders pentru a permite comenzi fără autentificare (guest checkout)

-- Face user_id nullable pentru a permite comenzi de la utilizatori neautentificați
ALTER TABLE public.orders 
  ALTER COLUMN user_id DROP NOT NULL;

-- Actualizează policy-urile pentru a permite inserări fără autentificare
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Policy: Permite inserări pentru toți (folosind service role key în server actions)
-- Notă: Server actions folosesc service role key, deci pot insera orice
-- RLS va fi bypass-uit pentru inserări din server actions
-- Pentru securitate, verificăm în aplicație că user_id corespunde cu sesiunea
CREATE POLICY "Allow order creation"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Comentariu actualizat
COMMENT ON COLUMN public.orders.user_id IS 'ID utilizator (NULL pentru comenzi guest)';

