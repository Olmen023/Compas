"use client";

import { TasksView } from "@/components/tasks/TasksView";

interface TasksTabsProps {
  userId: string;
  teams: any[];
}

export function TasksTabs({ userId, teams }: TasksTabsProps) {
  return <TasksView userId={userId} teams={teams} />;
}
