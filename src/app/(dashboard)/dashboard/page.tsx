import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-8 py-8">
      {/* Header - Notion Dark style */}
      <div className="py-2">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          ¡Bienvenido de vuelta, {profile?.full_name || user.email}!
        </h1>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cards de acceso rápido - Notion Dark style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="/calendar" className="group block">
          <div className="notion-card notion-shadow-hover p-5 cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-bg-primary p-2 rounded-md flex-shrink-0">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Calendario
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Gestiona tus eventos y reuniones
                </p>
              </div>
            </div>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Abrir
              <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>

        <a href="/tasks" className="group block">
          <div className="notion-card notion-shadow-hover p-5 cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-bg-secondary p-2 rounded-md flex-shrink-0">
                <svg
                  className="h-4 w-4 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Tareas
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Organiza y completa tus tareas
                </p>
              </div>
            </div>
            <div className="flex items-center text-secondary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Abrir
              <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>

        <a href="/teams" className="group block">
          <div className="notion-card notion-shadow-hover p-5 cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-bg-accent p-2 rounded-md flex-shrink-0">
                <svg
                  className="h-4 w-4 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Equipos
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Colabora con tu equipo
                </p>
              </div>
            </div>
            <div className="flex items-center text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
              Abrir
              <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      {/* Próximos pasos - Notion Dark style */}
      <div className="notion-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-sm font-semibold text-foreground">
            Comienza a usar Compás
          </h2>
        </div>
        <div className="space-y-1">
          <div className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-colors cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Has iniciado sesión correctamente</p>
              <p className="text-xs text-muted-foreground">Tu cuenta está lista para usar</p>
            </div>
          </div>

          <div className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-colors cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">1</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Crea tu primer equipo</p>
              <p className="text-xs text-muted-foreground">Invita a tu pareja o compañeros de equipo</p>
            </div>
          </div>

          <div className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-colors cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">2</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Agrega eventos al calendario</p>
              <p className="text-xs text-muted-foreground">Organiza reuniones y citas importantes</p>
            </div>
          </div>

          <div className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--sidebar-hover))] transition-colors cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">3</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Crea y comparte tareas</p>
              <p className="text-xs text-muted-foreground">Mantén el seguimiento de pendientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
