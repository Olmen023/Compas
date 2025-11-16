import { createClient } from "@/lib/supabase/client";

export interface Team {
  id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface TeamWithMembers extends Team {
  team_members: TeamMember[];
}

// Crear un nuevo equipo usando RPC (evita recursión RLS)
export async function createTeam(name: string, userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("create_team_with_owner", {
      p_name: name,
      p_user_id: userId,
    });

  if (error) throw error;

  return {
    id: data,
    name,
    type: "couple",
    created_by: userId,
    created_at: new Date().toISOString()
  };
}

// Obtener equipos del usuario usando RPC (evita recursión RLS)
export async function getUserTeams(userId: string): Promise<TeamWithMembers[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("get_user_teams", { p_user_id: userId });

  if (error) throw error;

  return data?.map((team: any) => ({
    id: team.id,
    name: team.name,
    type: team.type,
    created_by: team.created_by,
    created_at: team.created_at,
    userRole: team.user_role,
    team_members: team.team_members || [],
  })) || [];
}

// Actualizar equipo
export async function updateTeam(teamId: string, name: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("teams")
    .update({ name })
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar equipo
export async function deleteTeam(teamId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", teamId);

  if (error) throw error;
}

// Invitar miembro por email usando RPC (evita recursión RLS)
export async function inviteTeamMember(teamId: string, email: string, role: "admin" | "member" = "member") {
  const supabase = createClient();

  // Obtener el usuario actual para pasarlo como inviter
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuario no autenticado");

  const { data, error } = await supabase
    .rpc("invite_team_member", {
      p_team_id: teamId,
      p_email: email,
      p_role: role,
      p_inviter_id: user.id,
    });

  if (error) throw error;

  return { id: data };
}

// Eliminar miembro del equipo
export async function removeTeamMember(teamMemberId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", teamMemberId);

  if (error) throw error;
}

// Actualizar rol de miembro
export async function updateMemberRole(teamMemberId: string, role: "admin" | "member") {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("team_members")
    .update({ role })
    .eq("id", teamMemberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Suscribirse a cambios en equipos
export function subscribeToTeams(userId: string, callback: () => void) {
  const supabase = createClient();

  const channel = supabase
    .channel("teams-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "teams",
      },
      callback
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "team_members",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
