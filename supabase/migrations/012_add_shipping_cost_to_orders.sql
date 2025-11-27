-- Adaugă coloana shipping_cost în tabelul orders
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) DEFAULT 0;

-- Actualizează comenzile existente pentru a calcula shipping_cost
-- Dacă total - subtotal > 0, atunci shipping_cost = total - subtotal, altfel 0
UPDATE public.orders
SET shipping_cost = CASE 
  WHEN (total - subtotal) > 0 THEN (total - subtotal)
  ELSE 0
END
WHERE shipping_cost IS NULL OR shipping_cost = 0;

-- Comentariu pentru documentare
COMMENT ON COLUMN public.orders.shipping_cost IS 'Costul de livrare în lei';

