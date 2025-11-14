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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-b from-primary-50 to-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col gap-8">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-600 text-center">
          Compás
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 text-center">
          Gestión de Equipos y Coordinación de Parejas
        </p>
        <p className="text-gray-500 text-center max-w-2xl">
          Tu aplicación web para gestionar calendarios, tareas y colaboración en equipo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-center"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors text-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
