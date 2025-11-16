"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUserTeams, subscribeToTeams, TeamWithMembers } from "@/lib/services/teamService";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamCard } from "@/components/teams/TeamCard";
import { toast } from "sonner";

export default function TeamsPage() {
  const [teams, setTeams] = useState<(TeamWithMembers & { userRole?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  const loadTeams = async () => {
    if (!userId) return;

    try {
      const data = await getUserTeams(userId);
      setTeams(data);
    } catch (error: any) {
      toast.error("Error al cargar equipos", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Obtener usuario actual
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadTeams();

      // Suscribirse a cambios en tiempo real
      const unsubscribe = subscribeToTeams(userId, loadTeams);

      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Equipos
          </h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus equipos y colabora con otros miembros
          </p>
        </div>

        <CreateTeamDialog userId={userId} onTeamCreated={loadTeams} />
      </div>

      {/* Lista de equipos */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onUpdate={loadTeams} />
          ))}
        </div>
      ) : (
        <div className="notion-card p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
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

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No tienes equipos aún
              </h2>
              <p className="text-muted-foreground text-sm">
                Crea tu primer equipo para empezar a colaborar con otras personas
              </p>
            </div>

            <CreateTeamDialog userId={userId} onTeamCreated={loadTeams} />
          </div>
        </div>
      )}
    </div>
  );
}
