-- Șterge tabelele de analytics care nu mai sunt folosite

-- Șterge policy-urile
DROP POLICY IF EXISTS "Anyone can track page views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can track events" ON public.events;
DROP POLICY IF EXISTS "Admins can view page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can view events" ON public.events;

-- Șterge indexurile
DROP INDEX IF EXISTS public.idx_page_views_path;
DROP INDEX IF EXISTS public.idx_page_views_created_at;
DROP INDEX IF EXISTS public.idx_page_views_session_id;
DROP INDEX IF EXISTS public.idx_page_views_user_id;

DROP INDEX IF EXISTS public.idx_events_event_type;
DROP INDEX IF EXISTS public.idx_events_event_name;
DROP INDEX IF EXISTS public.idx_events_created_at;
DROP INDEX IF EXISTS public.idx_events_session_id;
DROP INDEX IF EXISTS public.idx_events_user_id;
DROP INDEX IF EXISTS public.idx_events_metadata;

-- Șterge tabelele
DROP TABLE IF EXISTS public.page_views;
DROP TABLE IF EXISTS public.events;

