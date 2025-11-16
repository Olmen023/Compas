# Guía de Deployment en Vercel

## 🔧 Configuración de Variables de Entorno

Para que la aplicación funcione correctamente en Vercel, **DEBES** configurar las siguientes variables de entorno:

### Variables Requeridas:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Valor: `https://aenwjynupkbsbmdrhcdh.supabase.co`
   - Descripción: URL de tu proyecto de Supabase

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - ⚠️ **IMPORTANTE**: Debes usar la **ANON KEY** (clave pública), NO la service_role key
   - Dónde encontrarla:
     1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard)
     2. Settings → API
     3. Copia la clave de "Project API keys" → "anon" → "public"
   - **NO uses la clave que está actualmente en .env.local** (esa es service_role)

### 📝 Cómo configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Settings"
3. Click en "Environment Variables" en el menú lateral
4. Agrega cada variable:
   - **Key**: Nombre de la variable (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: El valor correspondiente
   - **Environment**: Selecciona "Production", "Preview" y "Development"
5. Click en "Save"

### 🔄 Después de configurar:

1. Ve a la pestaña "Deployments"
2. Click en los tres puntos (...) del último deployment
3. Click en "Redeploy"
4. Selecciona "Use existing Build Cache" (opcional, más rápido)
5. Click en "Redeploy"

## ⚠️ IMPORTANTE: Seguridad

- **NUNCA** uses la `service_role` key en el frontend
- La `anon` key es segura para uso público
- Asegúrate de tener Row Level Security (RLS) habilitado en todas tus tablas de Supabase

## 🐛 Solución de Problemas

### Error: "Internal Server Error"
- ✅ Verifica que todas las variables de entorno estén configuradas
- ✅ Verifica que estés usando la ANON key, no la service_role key
- ✅ Haz un redeploy después de configurar las variables

### Error: "Unauthorized" o problemas de autenticación
- ✅ Verifica que las RLS policies estén configuradas correctamente en Supabase
- ✅ Verifica que las funciones RPC existan (`create_event`, `update_event`, `create_task`)

### Cómo ver los logs de error en Vercel:
1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en el deployment activo
4. Click en la pestaña "Functions"
5. Click en cualquier función para ver sus logs
6. Busca errores en rojo

## 📋 Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Usando ANON key (no service_role)
- [ ] Build local exitoso (`npm run build`)
- [ ] RLS policies configuradas en Supabase
- [ ] Funciones RPC creadas en Supabase (`create_event`, `update_event`, `create_task`)
