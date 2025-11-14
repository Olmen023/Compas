# Configuración de Base de Datos Supabase

## Problema Actual
Los errores `{}` en la consola indican que las tablas de la base de datos no están creadas o las políticas RLS bloquean el acceso.

## Pasos para Solucionar

### 1. Verificar la Configuración
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a "SQL Editor"
3. Copia y pega el contenido de `supabase/verify_setup.sql`
4. Ejecuta el script

**Resultado esperado:** Deberías ver las 6 tablas (profiles, teams, team_members, tasks, events, event_attendees)

### 2. Si las Tablas NO Existen
Necesitas ejecutar la migración inicial:

1. Ve a "SQL Editor" en Supabase
2. Abre el archivo `supabase/migrations/001_initial_schema.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Haz clic en "Run"

**IMPORTANTE:** Espera a que termine completamente antes de continuar.

### 3. Verificar tu Usuario
1. Ve a "Authentication" > "Users" en Supabase
2. Asegúrate de tener un usuario creado
3. Copia el UUID del usuario

### 4. Verificar tu Perfil
Ejecuta este SQL en el SQL Editor (reemplaza `TU_USER_ID` con el UUID de tu usuario):

```sql
SELECT * FROM profiles WHERE id = 'TU_USER_ID';
```

**Si NO hay resultados:** Tu perfil no se creó automáticamente. Créalo manualmente:

```sql
INSERT INTO profiles (id, email, full_name)
VALUES (
  'TU_USER_ID',
  'tu-email@ejemplo.com',
  'Tu Nombre'
);
```

### 5. Variables de Entorno
Verifica que tu archivo `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 6. Prueba la Aplicación
1. Reinicia el servidor de desarrollo
2. Recarga la página
3. Los errores deberían mostrar información detallada ahora

## Mensajes de Error Mejorados

Ahora los errores mostrarán:
- `message`: Descripción del error
- `details`: Detalles adicionales
- `hint`: Sugerencias para resolver el error
- `code`: Código del error

Esto te ayudará a identificar si:
- La tabla no existe
- No tienes permisos (RLS)
- Hay un error en la consulta
- No estás autenticado

## Siguiente Paso
Una vez que los errores estén solucionados, pasaremos a mejorar el diseño CSS de la aplicación.
