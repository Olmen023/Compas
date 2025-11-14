import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TasksView } from "@/components/tasks/TasksView";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tareas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Organiza y gestiona tus tareas pendientes
        </p>
      </div>

      <TasksView userId={user.id} teams={teams} />
    </div>
  );
}
