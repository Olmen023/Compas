"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon } from "lucide-react";
import styles from "./TeamMembers.module.css";

interface TeamMembersProps {
  teamId: string;
  userId: string;
  userRole: string;
  team: any;
}

export function TeamMembers({ teamId, userId, userRole, team }: TeamMembersProps) {
  const members = team.team_members || [];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge variant="default">Propietario</Badge>;
      case "admin":
        return <Badge variant="secondary">Administrador</Badge>;
      default:
        return <Badge variant="outline">Miembro</Badge>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>
          Miembros del Equipo ({members.length})
        </h2>
        <p>
          Personas que tienen acceso a este equipo
        </p>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <Card className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyIcon}>
              <UsersIcon />
            </div>
            <div>
              <h3 className={styles.emptyHeading}>
                No hay miembros
              </h3>
              <p className={styles.emptyText}>
                Este equipo aún no tiene miembros
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className={styles.membersGrid}>
          {members.map((member: any) => (
            <Card key={member.id} className={styles.memberCard}>
              <div className={styles.memberContent}>
                <Avatar className={styles.memberAvatar}>
                  {member.profiles?.avatar_url && (
                    <img
                      src={member.profiles.avatar_url}
                      alt={member.profiles?.full_name || ""}
                    />
                  )}
                </Avatar>
                <div className={styles.memberDetails}>
                  <h4 className={styles.memberName}>
                    {member.profiles?.full_name || "Usuario"}
                  </h4>
                  <div className={styles.memberRole}>
                    {getRoleBadge(member.role)}
                    {member.user_id === userId && (
                      <span className={styles.memberLabel}>(Tú)</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
