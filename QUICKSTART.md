# 🚀 Guía Rápida de Inicio - Compás

## ⚡ Pasos para Probar la Aplicación AHORA

### 1. Ejecutar las Migraciones SQL (CRÍTICO) ⚠️

**Esto es necesario antes de usar la aplicación por primera vez.**

1. Ve a https://app.supabase.com
2. Abre tu proyecto (ya está configurado)
3. En el menú lateral, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"**
5. Abre el archivo `supabase/migrations/001_initial_schema.sql` de este proyecto
6. Copia TODO el contenido del archivo
7. Pégalo en el editor SQL de Supabase
8. Haz clic en **"Run"** (botón verde en la esquina inferior derecha)
9. Deberías ver un mensaje de éxito

**Verificación**: Ve a "Table Editor" en Supabase y deberías ver estas tablas:
- profiles
- teams
- team_members
- tasks
- events
- event_attendees

### 2. Iniciar el Servidor

```bash
npm run dev
```

El servidor debería iniciar en http://localhost:3000

### 3. Probar el Flujo Completo

1. **Registrarse**
   - Ve a http://localhost:3000
   - Haz clic en "Registrarse"
   - Llena el formulario:
     - Nombre: Tu nombre
     - Email: tu@email.com
     - Contraseña: mínimo 6 caracteres
   - Haz clic en "Crear Cuenta"
   - Deberías ser redirigido al dashboard automáticamente

2. **Explorar el Dashboard**
   - Verás tu nombre de bienvenida
   - Hay 3 secciones: Calendario, Tareas, Equipos
   - La navegación superior funciona

3. **Cerrar Sesión**
   - Haz clic en el botón "Salir" en la esquina superior derecha
   - Deberías ser redirigido al login

4. **Iniciar Sesión**
   - Ve a http://localhost:3000/login
   - Ingresa tu email y contraseña
   - Deberías volver al dashboard

## ✅ Si Todo Funciona...

¡Perfecto! Has completado las **Fases 1 y 2** del proyecto.

## 🐛 Si Algo No Funciona...

### Error: "relation 'profiles' does not exist"
- **Causa**: No ejecutaste las migraciones SQL
- **Solución**: Sigue el Paso 1 de arriba

### Error: "Invalid API key"
- **Causa**: Las credenciales de Supabase son incorrectas
- **Solución**: Verifica el archivo `.env.local`

### Error: Puerto 3000 en uso
- **Solución**:
  ```bash
  # En Windows
  netstat -ano | findstr :3000
  taskkill /PID <número_del_proceso> /F

  # Luego reinicia
  npm run dev
  ```

### El login no funciona
- Verifica que hayas ejecutado las migraciones
- Abre la consola del navegador (F12) para ver errores
- Verifica que estés en la misma base de datos de Supabase

## 📋 Siguientes Pasos

Una vez que todo funcione:

1. **Explorar el código**:
   - Revisa `src/app/(auth)/login/page.tsx` - Página de login
   - Revisa `src/app/(dashboard)/dashboard/page.tsx` - Dashboard
   - Revisa `src/lib/supabase/` - Configuración de Supabase

2. **Siguiente fase**:
   - Fase 3: Mejorar el dashboard y navegación
   - Fase 4: Implementar el calendario
   - Fase 5: Sistema de tareas

## 🎯 Lo Que Ya Está Funcionando

✅ Autenticación completa (login/registro/logout)
✅ Base de datos con 6 tablas
✅ Row Level Security (RLS) configurado
✅ Middleware de protección de rutas
✅ Dashboard básico
✅ Navegación básica
✅ Sistema de notificaciones (toasts)
✅ Diseño responsive

## 🔗 Enlaces Útiles

- Dashboard de Supabase: https://app.supabase.com
- Tu proyecto: https://aenwjynupkbsbmdrhcdh.supabase.co
- Documentación: Ver `README.md` completo

---

**¿Listo para continuar?** Avísame cuando hayas probado todo y continuamos con las siguientes fases.
