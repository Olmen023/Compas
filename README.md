# Compás 🧭

Aplicación web de gestión de equipos y coordinación de parejas con calendario y tareas compartidas.

## 🎯 Descripción del Proyecto

Compás es una aplicación web progresiva (PWA) diseñada para ayudar a equipos y parejas a coordinar sus actividades, gestionar tareas y compartir calendarios de manera eficiente.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14+ con App Router y TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **Validación**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Hosting**: Vercel
- **PWA**: Next.js PWA

## 📦 Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <your-repo-url>
   cd Compas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Las credenciales de Supabase ya están configuradas en `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://aenwjynupkbsbmdrhcdh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[ya configurado]
   ```

4. **Ejecutar migraciones de base de datos**

   Ve a [supabase/README.md](./supabase/README.md) para instrucciones detalladas.

   Básicamente:
   - Abre https://app.supabase.com
   - Ve a SQL Editor
   - Copia y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📂 Estructura del Proyecto

```
compas/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Rutas protegidas
│   │   │   └── dashboard/
│   │   ├── auth/
│   │   │   └── signout/         # API route para logout
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/                  # Componentes shadcn/ui
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── card.tsx
│   │       └── toaster.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Cliente de Supabase (browser)
│   │   │   ├── server.ts        # Cliente de Supabase (server)
│   │   │   └── middleware.ts    # Middleware de autenticación
│   │   ├── store/
│   │   │   └── authStore.ts     # Store de Zustand
│   │   └── utils.ts
│   ├── types/
│   │   ├── database.types.ts    # Tipos de base de datos
│   │   └── index.ts             # Tipos compartidos
│   └── middleware.ts            # Middleware de Next.js
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── README.md
└── public/
    └── icons/                   # Íconos para PWA (pendiente)
```

## ✅ Progreso del Desarrollo

### Fase 1: Setup Inicial ✅ COMPLETADA
- [x] Proyecto Next.js con TypeScript
- [x] Tailwind CSS configurado
- [x] shadcn/ui configurado
- [x] Supabase configurado
- [x] Zustand stores básicos
- [x] Estructura de carpetas

### Fase 2: Base de Datos y Autenticación ✅ COMPLETADA
- [x] Schema de base de datos con todas las tablas
- [x] Row Level Security (RLS) policies
- [x] Triggers automáticos (crear perfil, agregar a equipo)
- [x] Página de login funcional
- [x] Página de registro funcional
- [x] Dashboard básico
- [x] Layout con navegación
- [x] Middleware de autenticación
- [x] Sistema de notificaciones (Toaster)

### Fase 3: Dashboard y Navegación 🔄 SIGUIENTE
- [ ] Layout completo con sidebar
- [ ] Navegación móvil responsive
- [ ] Página de configuración
- [ ] Perfil de usuario editable

### Fase 4: Calendario con CRUD ⏳ PENDIENTE
- [ ] Integrar librería de calendario
- [ ] CRUD de eventos
- [ ] Vista mensual/semanal/diaria
- [ ] Real-time updates
- [ ] Filtros por equipo

### Fase 5: Gestión de Tareas ⏳ PENDIENTE
- [ ] Lista de tareas
- [ ] Vista Kanban
- [ ] CRUD completo
- [ ] Asignación a miembros
- [ ] Real-time updates

### Fase 6: Sistema de Equipos ⏳ PENDIENTE
- [ ] Crear/editar equipos
- [ ] Invitar miembros
- [ ] Gestionar roles
- [ ] Compartir calendarios y tareas

### Fase 7: PWA ⏳ PENDIENTE
- [ ] Manifest.json
- [ ] Service Worker
- [ ] Íconos
- [ ] Instalación

### Fase 8: Polish y Deployment ⏳ PENDIENTE
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Validaciones
- [ ] Deploy a Vercel
- [ ] Testing

## 🗄️ Base de Datos

### Tablas Implementadas

1. **profiles** - Perfiles de usuario
2. **teams** - Equipos/parejas
3. **team_members** - Miembros de equipos con roles
4. **tasks** - Tareas individuales y de equipo
5. **events** - Eventos de calendario
6. **event_attendees** - Asistentes a eventos

### Políticas de Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado:
- Los usuarios solo pueden ver/editar sus propios datos
- Los miembros de un equipo pueden ver datos del equipo
- Solo owners/admins pueden modificar configuración de equipos

## 🔐 Autenticación

- Sistema de autenticación con Supabase Auth
- Email/Password
- Sesiones gestionadas automáticamente
- Middleware de Next.js para proteger rutas
- Redirecciones automáticas

## 🎨 Componentes UI

Componentes de shadcn/ui implementados:
- Button
- Input
- Label
- Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Toaster (notificaciones con Sonner)

## 🚧 Próximos Pasos Inmediatos

1. **Ejecutar las migraciones SQL** en Supabase (si no lo has hecho)
2. **Probar el flujo de autenticación**:
   - Ir a `/register` y crear una cuenta
   - Verificar que te redirige al dashboard
   - Probar logout
   - Volver a hacer login
3. **Continuar con Fase 3**: Mejorar el dashboard y navegación

## 📝 Notas Importantes

- **Middleware deprecado**: Next.js 16 tiene un warning sobre el archivo `middleware.ts`. Es solo un aviso y funciona correctamente.
- **Variables de entorno**: El archivo `.env.local` NO debe subirse a Git (ya está en .gitignore)
- **Supabase**: Asegúrate de ejecutar las migraciones SQL antes de probar la aplicación

## 🤝 Contribución

Este es un proyecto MVP en desarrollo. Las contribuciones son bienvenidas una vez completadas las fases principales.

## 📄 Licencia

ISC

## 🆘 Soporte

Si tienes problemas:
1. Verifica que las variables de entorno estén configuradas
2. Asegúrate de haber ejecutado las migraciones SQL
3. Revisa la consola del navegador para errores
4. Verifica que el servidor de desarrollo esté corriendo en el puerto correcto

---

**Estado**: En desarrollo activo - Fase 2 completada ✅
**Última actualización**: 2025-11-14
