import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TasksTabs } from "@/components/tasks/TasksTabs";

export default async function TasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's teams
  const { data: teamMemberships } = await supabase
    .from("team_members")
    .select("team_id, teams(id, name, type)")
    .eq("user_id", user.id);

  const teams = teamMemberships?.map((tm: any) => tm.teams) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tareas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona tus tareas personales y las de tu equipo
        </p>
      </div>

      <TasksTabs userId={user.id} teams={teams} />
    </div>
  );
}
