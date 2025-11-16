"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { getTasks, toggleTaskStatus, Task } from "@/lib/services/taskService";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import styles from "./TeamTasks.module.css";

interface TeamTasksProps {
  teamId: string;
  userId: string;
}

export function TeamTasks({ teamId, userId }: TeamTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(userId);
      // Filtrar solo tareas de este equipo
      const teamTasks = data.filter(task => task.team_id === teamId);
      setTasks(teamTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar las tareas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    // Suscribirse a cambios en tiempo real
    const supabase = createClient();
    const channel = supabase
      .channel(`team-tasks-${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `team_id=eq.${teamId}`,
        },
        () => loadTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, userId]);

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

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>
              Tareas del Equipo ({tasks.length})
            </h2>
            <p>
              {doneTasks.length} completadas, {todoTasks.length + inProgressTasks.length} pendientes
            </p>
          </div>
          <Button onClick={handleNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>

        {/* Kanban Board */}
        <div className={styles.kanbanBoard}>
          {/* TODO Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3>
                Por hacer ({todoTasks.length})
              </h3>
              <div className={`${styles.statusIndicator} ${styles.todo}`}></div>
            </div>
            <div className={styles.tasksList}>
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskCard}
                  onClick={() => handleEditTask(task)}
                >
                  <div className={styles.taskContent}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(task);
                      }}
                      className={styles.taskCheckbox}
                    >
                      <Circle className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className={styles.taskDetails}>
                      <h4 className={styles.taskTitle}>{task.title}</h4>
                      {task.description && (
                        <p className={styles.taskDescription}>
                          {task.description}
                        </p>
                      )}
                      <div className={styles.taskMeta}>
                        <span
                          className={`${styles.priorityBadge} ${styles[task.priority]}`}
                        >
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3>
                En progreso ({inProgressTasks.length})
              </h3>
              <div className={`${styles.statusIndicator} ${styles.inProgress}`}></div>
            </div>
            <div className={styles.tasksList}>
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskCard}
                  onClick={() => handleEditTask(task)}
                >
                  <div className={styles.taskContent}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(task);
                      }}
                      className={styles.taskCheckbox}
                    >
                      <Clock className="w-5 h-5 text-blue-500" />
                    </button>
                    <div className={styles.taskDetails}>
                      <h4 className={styles.taskTitle}>{task.title}</h4>
                      {task.description && (
                        <p className={styles.taskDescription}>
                          {task.description}
                        </p>
                      )}
                      <div className={styles.taskMeta}>
                        <span
                          className={`${styles.priorityBadge} ${styles[task.priority]}`}
                        >
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3>
                Completadas ({doneTasks.length})
              </h3>
              <div className={`${styles.statusIndicator} ${styles.done}`}></div>
            </div>
            <div className={styles.tasksList}>
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${styles.taskCard} ${styles.done}`}
                  onClick={() => handleEditTask(task)}
                >
                  <div className={styles.taskContent}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(task);
                      }}
                      className={styles.taskCheckbox}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </button>
                    <div className={styles.taskDetails}>
                      <h4 className={`${styles.taskTitle} ${styles.completed}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={styles.taskDescription}>
                          {task.description}
                        </p>
                      )}
                      <div className={styles.taskMeta}>
                        <span
                          className={`${styles.priorityBadge} ${styles[task.priority]}`}
                        >
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog - Pre-fill team_id */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={async () => {
          await loadTasks();
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        userId={userId}
        teams={[{ id: teamId }]} // Solo este equipo
      />
    </>
  );
}
