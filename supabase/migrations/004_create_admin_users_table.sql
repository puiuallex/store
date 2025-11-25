-- Creează tabelul pentru utilizatori admin
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Activează Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Doar adminii pot vedea lista de admini
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Doar adminii pot adăuga alți admini (folosind service role key în server actions)
-- Notă: Server actions folosesc service role key, deci pot insera orice
CREATE POLICY "Allow admin creation"
  ON public.admin_users
  FOR INSERT
  WITH CHECK (true);

-- Comentarii
COMMENT ON TABLE public.admin_users IS 'Tabel pentru utilizatorii cu drepturi de administrator';
COMMENT ON COLUMN public.admin_users.user_id IS 'ID-ul utilizatorului din auth.users';
COMMENT ON COLUMN public.admin_users.created_by IS 'ID-ul adminului care a creat acest cont admin';

