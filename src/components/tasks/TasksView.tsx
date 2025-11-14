"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { TaskDialog } from "./TaskDialog";
import { getTasks, toggleTaskStatus, Task } from "@/lib/services/taskService";
import { toast } from "sonner";

interface TasksViewProps {
  userId: string;
  teams: any[];
}

export function TasksView({ userId, teams }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar las tareas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
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
      console.error("Error toggling task status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDialogSave = async () => {
    await loadTasks();
    handleDialogClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
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

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      onClick={() => handleEditTask(task)}
      className="notion-card p-4 cursor-pointer hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(task);
          }}
          className="mt-0.5 flex-shrink-0"
        >
          {task.status === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium ${
              task.status === "done"
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
            {task.due_date && (
              <span className="text-xs text-muted-foreground">
                {new Date(task.due_date).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando tareas...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with create button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Mis Tareas ({tasks.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              {doneTasks.length} completadas, {todoTasks.length + inProgressTasks.length} pendientes
            </p>
          </div>
          <Button onClick={handleNewTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva tarea
          </Button>
        </div>

        {/* Tasks Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Por hacer ({todoTasks.length})
              </h3>
            </div>
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {todoTasks.length === 0 && (
                <div className="notion-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay tareas por hacer
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                En progreso ({inProgressTasks.length})
              </h3>
            </div>
            <div className="space-y-2">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="notion-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay tareas en progreso
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Completadas ({doneTasks.length})
              </h3>
            </div>
            <div className="space-y-2">
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {doneTasks.length === 0 && (
                <div className="notion-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay tareas completadas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        task={selectedTask}
        userId={userId}
        teams={teams}
      />
    </>
  );
}
