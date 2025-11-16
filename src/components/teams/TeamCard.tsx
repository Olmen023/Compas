"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Settings, UserPlus, Crown, Shield, User, ArrowRight } from "lucide-react";
import { TeamWithMembers } from "@/lib/services/teamService";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { ManageMembersDialog } from "./ManageMembersDialog";

interface TeamCardProps {
  team: TeamWithMembers & { userRole?: string };
  onUpdate: () => void;
}

export function TeamCard({ team, onUpdate }: TeamCardProps) {
  const router = useRouter();
  const [showInvite, setShowInvite] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const isOwnerOrAdmin = team.userRole === "owner" || team.userRole === "admin";
  const memberCount = team.team_members?.length || 0;

  const handleCardClick = () => {
    router.push(`/teams/${team.id}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3" />;
      case "admin":
        return <Shield className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Propietario";
      case "admin":
        return "Admin";
      default:
        return "Miembro";
    }
  };

  return (
    <>
      <Card className="notion-card hover-lift cursor-pointer" onClick={handleCardClick}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {team.name}
                <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                  {getRoleIcon(team.userRole || "member")}
                  {getRoleText(team.userRole || "member")}
                </span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Miembros */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{memberCount} {memberCount === 1 ? "miembro" : "miembros"}</span>
                </div>
              </div>

              {/* Lista de avatares */}
              <div className="flex -space-x-2">
                {team.team_members?.slice(0, 5).map((member) => (
                  <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                    <AvatarImage src={member.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {member.profiles?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {memberCount > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{memberCount - 5}
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            {isOwnerOrAdmin && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInvite(true);
                  }}
                  className="flex-1"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invitar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowManage(true);
                  }}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gestionar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <InviteMemberDialog
        open={showInvite}
        onOpenChange={setShowInvite}
        teamId={team.id}
        teamName={team.name}
        onMemberInvited={onUpdate}
      />

      <ManageMembersDialog
        open={showManage}
        onOpenChange={setShowManage}
        team={team}
        onUpdate={onUpdate}
      />
    </>
  );
}
