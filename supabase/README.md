# Supabase Database Setup

## Cómo ejecutar las migraciones

### Opción 1: Desde el Dashboard de Supabase (Recomendado para MVP)

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia todo el contenido del archivo `migrations/001_initial_schema.sql`
5. Pégalo en el editor SQL
6. Haz clic en **Run** para ejecutar la migración

### Opción 2: Usando Supabase CLI

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Inicializar Supabase en el proyecto
supabase init

# Vincular con tu proyecto remoto
supabase link --project-ref aenwjynupkbsbmdrhcdh

# Aplicar migraciones
supabase db push
```

## Verificación

Después de ejecutar la migración, verifica que se hayan creado las siguientes tablas:

- ✅ profiles
- ✅ teams
- ✅ team_members
- ✅ tasks
- ✅ events
- ✅ event_attendees

Puedes verificarlo en: **Table Editor** en el dashboard de Supabase.

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con las siguientes políticas:

- **profiles**: Los usuarios solo pueden ver/editar su propio perfil
- **teams**: Los usuarios solo ven equipos de los que son miembros
- **team_members**: Solo miembros del equipo pueden ver otros miembros
- **tasks**: Los usuarios ven sus tareas personales y las de sus equipos
- **events**: Los usuarios ven eventos propios, de equipos o donde son invitados
- **event_attendees**: Solo participantes del evento pueden ver la lista

## Triggers Automáticos

1. **on_auth_user_created**: Crea automáticamente un perfil cuando un usuario se registra
2. **on_team_created**: Agrega al creador como 'owner' del equipo automáticamente
3. **set_updated_at**: Actualiza el campo updated_at en profiles, tasks y events

## Testing

Puedes probar las políticas RLS desde el SQL Editor con:

```sql
-- Ver tu perfil
SELECT * FROM profiles WHERE id = auth.uid();

-- Ver tus equipos
SELECT * FROM teams;

-- Ver tus tareas
SELECT * FROM tasks;
```
