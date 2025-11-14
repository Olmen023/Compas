-- =============================================
-- Script de Verificación de Base de Datos
-- Ejecuta este script en el SQL Editor de Supabase
-- =============================================

-- 1. Verificar que las tablas existen
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('profiles', 'teams', 'team_members', 'tasks', 'events', 'event_attendees')
ORDER BY table_name;

-- 2. Verificar las políticas RLS están habilitadas
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'teams', 'team_members', 'tasks', 'events', 'event_attendees');

-- 3. Contar políticas RLS por tabla
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 4. Verificar que existe tu perfil de usuario
-- Reemplaza 'TU_USER_ID' con el ID de tu usuario de Supabase
-- SELECT * FROM profiles WHERE id = auth.uid();

-- 5. Verificar extensiones necesarias
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
