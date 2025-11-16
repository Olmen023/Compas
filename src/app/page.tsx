import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <div className="z-10 max-w-2xl w-full items-center justify-center flex flex-col gap-6 text-center">
        {/* Logo/Title con efecto glass */}
        <div className="glass rounded-3xl p-8 shadow-2xl hover-lift w-full">
          <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-4">
            Compás
          </h1>
          <div className="h-1 w-24 mx-auto gradient-primary rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-3">
            Gestión de Equipos y Coordinación de Parejas
          </p>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            Tu aplicación web para gestionar calendarios, tareas y colaboración en equipo de forma sencilla y eficiente
          </p>
        </div>

        {/* Botones de Acción - Verticales */}
        <div className="flex flex-col gap-4 w-full max-w-md mt-4">
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center overflow-hidden"
          >
            <span className="relative z-10">Iniciar Sesión</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/register"
            className="group relative px-8 py-4 bg-white border-3 border-primary-500 text-primary-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center overflow-hidden"
          >
            <span className="relative z-10">Crear Cuenta</span>
            <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Features destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
          <div className="glass p-4 rounded-xl text-center hover-lift">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm font-medium text-gray-700">Calendarios</p>
          </div>
          <div className="glass p-4 rounded-xl text-center hover-lift">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-medium text-gray-700">Tareas</p>
          </div>
          <div className="glass p-4 rounded-xl text-center hover-lift">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-700">Equipos</p>
          </div>
        </div>
      </div>
    </main>
  );
}
