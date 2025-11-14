# 📚 Documentación - Compás

Bienvenido a la documentación del proyecto Compás. Esta carpeta contiene toda la información técnica y guías del proyecto.

## 📖 Documentos Disponibles

### Guías Principales
- **[QUICKSTART.md](../QUICKSTART.md)** - Guía rápida para empezar a usar la aplicación
- **[README.md](../README.md)** - Documentación general del proyecto
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Configuración de la base de datos Supabase

### Registro de Cambios
- **[Session Log](../.claude/session-log.md)** - Registro de todas las sesiones de desarrollo con Claude Code

### Archivo
- **[archive/](./archive/)** - Documentación histórica y archivada

## 🗂️ Estructura del Proyecto

```
Compás/
├── .claude/
│   └── session-log.md          # Registro de sesiones de desarrollo
├── docs/
│   ├── README.md               # Este archivo
│   ├── DATABASE_SETUP.md       # Guía de base de datos
│   └── archive/                # Documentación archivada
├── public/
│   └── icons/                  # Iconos de la aplicación
├── src/
│   ├── app/                    # Páginas y rutas de Next.js
│   │   ├── (auth)/            # Páginas de autenticación
│   │   ├── (dashboard)/       # Páginas del dashboard
│   │   ├── auth/              # API de autenticación
│   │   ├── globals.css        # Estilos globales y variables CSS
│   │   ├── layout.tsx         # Layout principal
│   │   └── manifest.ts        # Manifest PWA
│   ├── components/            # Componentes React
│   │   ├── calendar/         # Componentes del calendario
│   │   ├── dashboard/        # Componentes del dashboard
│   │   ├── settings/         # Componentes de configuración
│   │   └── ui/               # Componentes UI base (shadcn/ui)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilidades y servicios
│   │   ├── services/         # Servicios de la aplicación
│   │   ├── store/            # Estado global (Zustand)
│   │   ├── supabase/         # Cliente de Supabase
│   │   └── utils/            # Funciones utilitarias
│   └── types/                # Tipos de TypeScript
├── supabase/
│   └── migrations/           # Migraciones de base de datos
├── .gitignore               # Archivos ignorados por Git
├── components.json          # Configuración de shadcn/ui
├── next.config.js          # Configuración de Next.js
├── package.json            # Dependencias del proyecto
├── postcss.config.js       # Configuración de PostCSS
├── tailwind.config.ts      # Configuración de Tailwind CSS
└── tsconfig.json           # Configuración de TypeScript
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: `#8B5CF6` (Púrpura vibrante) - `hsl(262 83% 58%)`
- **Secondary**: `#EC4899` (Rosa/Magenta) - `hsl(340 82% 62%)`
- **Accent**: `#06B6D4` (Cyan brillante) - `hsl(189 94% 43%)`

### Utilidades CSS Personalizadas
Definidas en `src/app/globals.css`:
- `.gradient-text` - Texto con gradiente animado
- `.glass` - Efecto glassmorphism
- `.hover-lift` - Elevación en hover
- `.gradient-primary/secondary/accent` - Fondos con gradiente
- `.gradient-border` - Borde animado con gradiente
- `.transition-smooth` - Transiciones suaves de 300ms

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4 + Custom CSS Variables
- **UI Components**: Radix UI (shadcn/ui)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estado**: Zustand
- **Calendario**: react-big-calendar
- **Validación**: Zod + React Hook Form
- **Notificaciones**: Sonner

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint

# Limpiar caché de Next.js
rm -rf .next
npm run dev
```

## 📝 Convenciones de Código

### Componentes
- Usar "use client" solo cuando sea necesario (interactividad)
- Preferir Server Components cuando sea posible
- Nombres en PascalCase para componentes

### Estilos
- Usar variables CSS para colores (`text-foreground`, `bg-card`, etc.)
- Preferir utilidades de Tailwind sobre CSS custom
- Usar clases custom solo para efectos complejos

### Archivos
- `page.tsx` - Páginas de Next.js
- `layout.tsx` - Layouts de Next.js
- `route.ts` - API routes
- `*.tsx` - Componentes React con TypeScript
- `*.ts` - TypeScript sin JSX

## 🔒 Seguridad

- Variables de entorno en `.env.local` (nunca commitear)
- Row Level Security (RLS) habilitado en Supabase
- Autenticación manejada por Supabase
- Middleware de protección de rutas en `src/middleware.ts`

## 📞 Soporte

Para problemas o preguntas:
1. Revisar la documentación en `/docs`
2. Verificar el session-log en `.claude/session-log.md`
3. Consultar el README principal

---

Última actualización: 14 de Noviembre 2025
