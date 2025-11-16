"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Clock, Users as UsersIcon } from "lucide-react";
import { TaskDialog } from "./TaskDialog";
import { getTasks, toggleTaskStatus, Task } from "@/lib/services/taskService";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamTasksViewProps {
  userId: string;
  teams: any[];
}

export function TeamTasksView({ userId, teams }: TeamTasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>(teams[0]?.id || "all");

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(userId);
      // Filtrar solo las tareas que tienen team_id
      const teamTasks = data.filter(task => task.team_id !== null);
      setTasks(teamTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar las tareas de equipo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    // Suscribirse a cambios en tiempo real
    const supabase = createClient();
    const channel = supabase
      .channel("team-tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `team_id=neq.null`,
        },
        (payload) => {
          console.log("Team task change received:", payload);
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await toggleTaskStatus(task);
      await loadTasks();
      toast.success("Estado actualizado");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "Personal";
    const team = teams.find(t => t.id === teamId);
    return team?.name || "Equipo desconocido";
  };

  const filteredTasks = selectedTeam === "all"
    ? tasks
    : tasks.filter(task => task.team_id === selectedTeam);

  const groupedTasks = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  if (teams.length === 0) {
    return (
      <div className="notion-card p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No tienes equipos
            </h2>
            <p className="text-muted-foreground text-sm">
              Crea o únete a un equipo para empezar a colaborar en tareas
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtro de equipo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los equipos</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleNewTask} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea de Equipo
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Por hacer ({groupedTasks.todo.length})
            </h3>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
          <div className="space-y-3">
            {groupedTasks.todo.map((task) => (
              <div
                key={task.id}
                className="notion-card p-4 cursor-pointer hover-lift"
                onClick={() => handleEditTask(task)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(task);
                    }}
                    className="mt-1"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-2">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-md border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                      {task.team_id && (
                        <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                          <UsersIcon className="w-3 h-3" />
                          {getTeamName(task.team_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              En progreso ({groupedTasks.in_progress.length})
            </h3>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <div className="space-y-3">
            {groupedTasks.in_progress.map((task) => (
              <div
                key={task.id}
                className="notion-card p-4 cursor-pointer hover-lift"
                onClick={() => handleEditTask(task)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(task);
                    }}
                    className="mt-1"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-2">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-md border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                      {task.team_id && (
                        <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                          <UsersIcon className="w-3 h-3" />
                          {getTeamName(task.team_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Completadas ({groupedTasks.done.length})
            </h3>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-3">
            {groupedTasks.done.map((task) => (
              <div
                key={task.id}
                className="notion-card p-4 cursor-pointer hover-lift opacity-75"
                onClick={() => handleEditTask(task)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(task);
                    }}
                    className="mt-1"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-2 line-through">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-md border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                      {task.team_id && (
                        <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                          <UsersIcon className="w-3 h-3" />
                          {getTeamName(task.team_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={loadTasks}
        task={selectedTask}
        userId={userId}
        teams={teams}
      />
    </div>
  );
}
