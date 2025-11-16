"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "@/lib/services/taskService";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  task: Task | null;
  userId: string;
  teams: any[];
}

export function TaskDialog({
  isOpen,
  onClose,
  onSave,
  task,
  userId,
  teams,
}: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        setTitle(task.title);
        setDescription(task.description || "");
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : "");
        setTeamId(task.team_id || "");
        setAssignedTo(task.assigned_to || "");
      } else {
        // Creating new task
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setDueDate("");
        setTeamId("");
        setAssignedTo("");
      }
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        due_date: dueDate || null,
        team_id: teamId || null,
        assigned_to: assignedTo || null,
        created_by: userId,
      };

      if (task) {
        // Update existing task
        await updateTask(task.id, taskData);
        toast.success("Tarea actualizada correctamente");
      } else {
        // Create new task
        await createTask(taskData);
        toast.success("Tarea creada correctamente");
      }

      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error al guardar la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTask(task.id);
      toast.success("Tarea eliminada correctamente");
      onSave();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error al eliminar la tarea");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Editar Tarea" : "Nueva Tarea"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Modifica los detalles de la tarea"
              : "Crea una nueva tarea para gestionar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Completar informe"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agrega detalles sobre la tarea..."
              rows={3}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="done">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Fecha de vencimiento</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Team Selection */}
          {teams.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="team">Equipo (opcional)</Label>
              <Select value={teamId || "personal"} onValueChange={(value) => setTeamId(value === "personal" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Solo para mí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Solo para mí</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex-1">
              {task && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Guardando..."
                  : task
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
