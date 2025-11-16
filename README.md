# Compás 🧭

Aplicación web de gestión de equipos y coordinación de parejas con calendario y tareas compartidas.

## 🎯 Descripción del Proyecto

Compás es una aplicación web progresiva (PWA) diseñada para ayudar a equipos y parejas a coordinar sus actividades, gestionar tareas y compartir calendarios de manera eficiente.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 con App Router y TypeScript
- **Estilos**: CSS Modules + CSS Variables (migrado desde Tailwind)
- **UI Components**: shadcn/ui (migrados a CSS Modules)
- **Estado**: Zustand
- **Validación**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Calendario**: React Big Calendar
- **Notificaciones**: Sonner
- **PWA**: Manifest.json + Service Worker

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
- [x] Proyecto Next.js 16 con TypeScript
- [x] CSS Modules configurado (migrado desde Tailwind)
- [x] shadcn/ui migrado a CSS Modules
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

### Fase 3: Dashboard y Navegación ✅ COMPLETADA
- [x] Layout completo con sidebar (desktop + mobile)
- [x] Navegación móvil responsive
- [x] Página de configuración
- [x] Perfil de usuario visualización

### Fase 4: Calendario con CRUD ✅ COMPLETADA
- [x] Integrar React Big Calendar
- [x] CRUD de eventos completo
- [x] Vista mensual/semanal/diaria
- [x] Real-time updates con Supabase
- [x] Filtros por equipo/personal
- [x] Colores mejorados para mejor contraste
- [x] Mostrar nombre y horario de eventos
- [x] Modal de creación/edición de eventos

### Fase 5: Gestión de Tareas ✅ COMPLETADA
- [x] Lista de tareas con CRUD completo
- [x] Estados y prioridades
- [x] Filtros y búsqueda
- [x] Real-time updates
- [x] Asignación a equipos

### Fase 6: Sistema de Equipos ⏳ EN PROGRESO
- [x] Estructura de base de datos
- [x] Página de equipos básica
- [ ] Crear/editar equipos (UI pendiente)
- [ ] Invitar miembros (UI pendiente)
- [ ] Gestionar roles (UI pendiente)

### Fase 7: PWA ✅ COMPLETADA
- [x] Manifest.json configurado
- [x] Íconos SVG generados
- [x] Script generador de íconos PNG
- [x] PWA instalable
- [ ] Service Worker (opcional)

### Fase 8: Polish y Deployment ⏳ SIGUIENTE
- [x] Manejo de errores básico
- [x] Loading states
- [x] Notificaciones toast
- [ ] Validación avanzada de formularios
- [ ] Deploy a Vercel
- [ ] Testing automatizado

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

Todos los componentes migrados a CSS Modules:
- **Button** - Variantes: default, destructive, outline, secondary, ghost, link
- **Input** - Inputs de formulario estilizados
- **Label** - Labels accesibles
- **Card** - Cards con Header, Title, Description, Content, Footer
- **Dialog** - Modales accesibles
- **Select** - Selectores personalizados
- **Textarea** - Áreas de texto
- **Switch** - Toggles on/off
- **Tabs** - Pestañas de navegación
- **Avatar** - Avatares de usuario
- **Sheet** - Paneles laterales (mobile nav)
- **Separator** - Separadores visuales
- **Toaster** - Notificaciones con Sonner

## 🎨 Sistema de Estilos

### Migración de Tailwind a CSS Modules

El proyecto ha sido completamente migrado de Tailwind CSS a CSS Modules para:
- ✅ Mejor control sobre estilos
- ✅ Eliminación de dependencias no utilizadas
- ✅ Mejor rendimiento
- ✅ Estilos más mantenibles

### Variables CSS Globales

Ubicadas en `src/styles/variables.css`:
- Colores del tema (primarios, secundarios, backgrounds)
- Tamaños de texto
- Espaciados
- Radios de bordes
- Sombras
- Transiciones

### Utilidades Disponibles

El archivo `globals.css` incluye clases utilitarias para:
- Flexbox y Grid
- Espaciado (margin, padding, gap)
- Tamaños de texto
- Colores
- Efectos (hover, transiciones, sombras)
- Responsive design

## 🧭 Generación de Íconos PWA

Para generar los íconos de la PWA:

1. Abre el archivo `scripts/generate-icons.html` en tu navegador
2. Click en "Generate Icons"
3. Los íconos se descargarán automáticamente
4. Mueve los archivos PNG a `public/icons/`

Tamaños generados: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## 🚧 Próximos Pasos Inmediatos

1. **Generar íconos PWA**:
   - Abrir `scripts/generate-icons.html` en el navegador
   - Click en "Generate Icons"
   - Mover archivos PNG a `public/icons/`

2. **Completar UI de Equipos**:
   - Implementar formulario de creación de equipos
   - Sistema de invitaciones
   - Gestión de roles y permisos

3. **Optimizaciones**:
   - Agregar validación avanzada en formularios
   - Mejorar manejo de errores
   - Implementar tests

4. **Deploy**:
   - Configurar Vercel
   - Variables de entorno en producción
   - Dominio personalizado (opcional)

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

## 🎯 Características Implementadas

- ✅ **Autenticación completa** con registro, login y logout
- ✅ **Dashboard** con resumen de actividades
- ✅ **Calendario interactivo** con vistas mes/semana/día
- ✅ **Gestión de eventos** con CRUD completo y tiempo real
- ✅ **Sistema de tareas** con prioridades y filtros
- ✅ **Navegación responsive** desktop y mobile
- ✅ **PWA instalable** con manifest y íconos
- ✅ **Tema oscuro** optimizado para Notion-style
- ✅ **Real-time** updates con Supabase
- ✅ **Notificaciones** toast con Sonner

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Construir para producción
npm start                # Iniciar servidor de producción

# Linting
npm run lint             # Ejecutar ESLint
```

## 📸 Screenshots

> Agrega screenshots aquí cuando el proyecto esté listo

---

**Estado**: MVP Funcional - Fases 1-5 y 7 completadas ✅
**Última actualización**: 2025-11-15
**Versión**: 1.0.0
