"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Shield, User, Trash2 } from "lucide-react";
import { TeamWithMembers, removeTeamMember, updateMemberRole } from "@/lib/services/teamService";
import { toast } from "sonner";

interface ManageMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamWithMembers & { userRole?: string };
  onUpdate: () => void;
}

export function ManageMembersDialog({
  open,
  onOpenChange,
  team,
  onUpdate,
}: ManageMembersDialogProps) {
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const isOwner = team.userRole === "owner";

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${memberName} del equipo?`)) {
      return;
    }

    setLoadingMemberId(memberId);

    try {
      await removeTeamMember(memberId);
      toast.success("Miembro eliminado del equipo");
      onUpdate();
    } catch (error: any) {
      toast.error("Error al eliminar miembro", {
        description: error.message,
      });
    } finally {
      setLoadingMemberId(null);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: "admin" | "member") => {
    setLoadingMemberId(memberId);

    try {
      await updateMemberRole(memberId, newRole);
      toast.success("Rol actualizado");
      onUpdate();
    } catch (error: any) {
      toast.error("Error al actualizar rol", {
        description: error.message,
      });
    } finally {
      setLoadingMemberId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestionar Miembros</DialogTitle>
          <DialogDescription>
            Administra los miembros de {team.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {team.team_members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar>
                  <AvatarImage src={member.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.profiles?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {member.profiles?.full_name || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unido {new Date(member.joined_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {member.role === "owner" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
                    {getRoleIcon(member.role)}
                    <span>Propietario</span>
                  </div>
                ) : isOwner ? (
                  <>
                    <Select
                      value={member.role}
                      onValueChange={(value) => handleUpdateRole(member.id, value as "admin" | "member")}
                      disabled={loadingMemberId === member.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Miembro</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id, member.profiles?.full_name || "este usuario")}
                      disabled={loadingMemberId === member.id}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getRoleIcon(member.role)}
                    <span className="capitalize">{member.role}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
