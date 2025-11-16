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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  CalendarEvent,
} from "@/lib/services/eventService";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  event: CalendarEvent | null;
  slot: { start: Date; end: Date } | null;
  userId: string;
  teams: any[];
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  event,
  slot,
  userId,
  teams,
}: EventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [teamId, setTeamId] = useState<string>("");

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setTitle(event.title);
        setDescription(event.description || "");
        setAllDay(event.all_day);
        setTeamId(event.team_id || "");

        const start = new Date(event.start_time);
        const end = new Date(event.end_time);

        setStartDate(format(start, "yyyy-MM-dd"));
        setStartTime(format(start, "HH:mm"));
        setEndDate(format(end, "yyyy-MM-dd"));
        setEndTime(format(end, "HH:mm"));
      } else if (slot) {
        // Creating new event from slot selection
        setTitle("");
        setDescription("");
        setAllDay(false);
        setTeamId("");

        setStartDate(format(slot.start, "yyyy-MM-dd"));
        setStartTime(format(slot.start, "HH:mm"));
        setEndDate(format(slot.end, "yyyy-MM-dd"));
        setEndTime(format(slot.end, "HH:mm"));
      } else {
        // Creating new event from button
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        setTitle("");
        setDescription("");
        setAllDay(false);
        setTeamId("");

        setStartDate(format(now, "yyyy-MM-dd"));
        setStartTime(format(now, "HH:mm"));
        setEndDate(format(oneHourLater, "yyyy-MM-dd"));
        setEndTime(format(oneHourLater, "HH:mm"));
      }
    }
  }, [isOpen, event, slot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    setIsLoading(true);

    try {
      let startDateTime: string;
      let endDateTime: string;

      if (allDay) {
        // Para eventos de todo el día, usar el inicio del día
        startDateTime = `${startDate}T00:00:00`;
        endDateTime = `${endDate}T23:59:59`;
      } else {
        startDateTime = `${startDate}T${startTime}:00`;
        endDateTime = `${endDate}T${endTime}:00`;
      }

      const eventData = {
        title: title.trim(),
        description: description.trim() || null,
        start_time: startDateTime,
        end_time: endDateTime,
        all_day: allDay,
        team_id: teamId || null,
        created_by: userId,
      };

      if (event) {
        // Update existing event
        await updateEvent(event.id, eventData);
        toast.success("Evento actualizado correctamente");
      } else {
        // Create new event
        await createEvent(eventData);
        toast.success("Evento creado correctamente");
      }

      onSave();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Error al guardar el evento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEvent(event.id);
      toast.success("Evento eliminado correctamente");
      onSave();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error al eliminar el evento");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? "Editar Evento" : "Nuevo Evento"}
          </DialogTitle>
          <DialogDescription>
            {event
              ? "Modifica los detalles del evento"
              : "Crea un nuevo evento en tu calendario"}
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
              placeholder="Ej: Reunión de equipo"
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
              placeholder="Agrega detalles sobre el evento..."
              rows={3}
            />
          </div>

          {/* All Day Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="all-day"
              checked={allDay}
              onCheckedChange={setAllDay}
            />
            <Label htmlFor="all-day">Evento de todo el día</Label>
          </div>

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha de inicio *</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            {!allDay && (
              <div className="space-y-2">
                <Label htmlFor="start-time">Hora de inicio *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha de fin *</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            {!allDay && (
              <div className="space-y-2">
                <Label htmlFor="end-time">Hora de fin *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Team Selection */}
          {teams.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="team">Equipo (opcional)</Label>
              <Select
                value={teamId || "personal"}
                onValueChange={(value) => setTeamId(value === "personal" ? "" : value)}
              >
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

          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex-1">
              {event && (
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
                  : event
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
