import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TeamDashboard } from "@/components/teams/TeamDashboard";

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const supabase = await createClient();
  const { teamId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verificar que el usuario es miembro del equipo
  const { data: membership } = await supabase
    .from("team_members")
    .select("*, teams(*)")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    redirect("/teams");
  }

  return (
    <TeamDashboard
      teamId={teamId}
      team={membership.teams}
      userId={user.id}
      userRole={membership.role}
    />
  );
}
