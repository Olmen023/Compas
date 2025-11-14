import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Sidebar para desktop */}
      <Sidebar user={user} profile={profile} />

      {/* Header móvil */}
      <MobileNav user={user} profile={profile} />

      {/* Contenido principal */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
