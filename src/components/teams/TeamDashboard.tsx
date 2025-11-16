"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, CheckSquare, Users } from "lucide-react";
import { TeamDocuments } from "./TeamDocuments";
import { TeamCalendar } from "./TeamCalendar";
import { TeamTasks } from "./TeamTasks";
import { TeamMembers } from "./TeamMembers";
import styles from "./TeamDashboard.module.css";

interface TeamDashboardProps {
  teamId: string;
  team: any;
  userId: string;
  userRole: string;
}

export function TeamDashboard({ teamId, team, userId, userRole }: TeamDashboardProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{team.name}</h1>
        <p className={styles.subtitle}>
          Dashboard del equipo · {userRole === "owner" ? "Propietario" : userRole === "admin" ? "Administrador" : "Miembro"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className={styles.tabsContainer}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="documents" className={styles.tabTrigger}>
            <FileText className={styles.icon} />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="calendar" className={styles.tabTrigger}>
            <Calendar className={styles.icon} />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="tasks" className={styles.tabTrigger}>
            <CheckSquare className={styles.icon} />
            Tareas
          </TabsTrigger>
          <TabsTrigger value="members" className={styles.tabTrigger}>
            <Users className={styles.icon} />
            Miembros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className={styles.tabContent}>
          <TeamDocuments teamId={teamId} userId={userId} />
        </TabsContent>

        <TabsContent value="calendar" className={styles.tabContent}>
          <TeamCalendar teamId={teamId} userId={userId} />
        </TabsContent>

        <TabsContent value="tasks" className={styles.tabContent}>
          <TeamTasks teamId={teamId} userId={userId} />
        </TabsContent>

        <TabsContent value="members" className={styles.tabContent}>
          <TeamMembers teamId={teamId} userId={userId} userRole={userRole} team={team} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
