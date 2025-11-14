"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  getUserEvents,
  getUserTeams,
  subscribeToEvents,
  CalendarEvent,
} from "@/lib/services/eventService";
import { createClient } from "@/lib/supabase/client";
import { EventDialog } from "./EventDialog";
import { TeamFilter } from "./TeamFilter";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEventWithDates extends CalendarEvent {
  start: Date;
  end: Date;
}

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEventWithDates[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEventWithDates[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // Estado del dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Obtener el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Cargar eventos y equipos
  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Cargar eventos y equipos en paralelo
      const [eventsData, teamsData] = await Promise.all([
        getUserEvents(userId),
        getUserTeams(userId),
      ]);

      // Convertir las fechas de string a Date
      const eventsWithDates = eventsData.map((event) => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));

      setEvents(eventsWithDates);
      setFilteredEvents(eventsWithDates);
      setTeams(teamsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los eventos");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToEvents(userId, () => {
      // Recargar eventos cuando hay cambios
      loadData();
    });

    return unsubscribe;
  }, [userId, loadData]);

  // Filtrar eventos por equipo
  useEffect(() => {
    if (selectedTeams.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          !event.team_id || selectedTeams.includes(event.team_id)
      );
      setFilteredEvents(filtered);
    }
  }, [selectedTeams, events]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    // Usar setTimeout para evitar que el click del calendario cierre el sheet
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEventWithDates) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    // Usar setTimeout para evitar que el click del calendario cierre el sheet
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 0);
  }, []);

  const handleEventSaved = useCallback(() => {
    loadData();
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  }, [loadData]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  }, []);

  const eventStyleGetter = (event: CalendarEventWithDates) => {
    // Colores vibrantes con gradientes para diferentes tipos de eventos
    const eventColors = {
      team: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)", // Púrpura a Rosa
      personal: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", // Cyan a Azul
    };

    const style = {
      background: event.team_id ? eventColors.team : eventColors.personal,
      borderRadius: "8px",
      color: "white",
      border: "none",
      display: "block",
      fontWeight: "600",
    };
    return { style };
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-6 glass shadow-lg hover-lift">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-smooth hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
            <TeamFilter
              teams={teams}
              selectedTeams={selectedTeams}
              onTeamsChange={setSelectedTeams}
            />
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("month")}
              className={`font-semibold transition-smooth ${
                view === "month"
                  ? "gradient-primary text-white shadow-md"
                  : "hover:bg-muted"
              }`}
            >
              Mes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("week")}
              className={`font-semibold transition-smooth ${
                view === "week"
                  ? "gradient-primary text-white shadow-md"
                  : "hover:bg-muted"
              }`}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("day")}
              className={`font-semibold transition-smooth ${
                view === "day"
                  ? "gradient-primary text-white shadow-md"
                  : "hover:bg-muted"
              }`}
            >
              Día
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <Card className="p-6 glass shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-semibold text-lg">Cargando eventos...</p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            style={{ height: 600 }}
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango",
              showMore: (total) => `+ Ver más (${total})`,
            }}
            culture="es"
          />
        )}
      </Card>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleEventSaved}
        event={selectedEvent}
        slot={selectedSlot}
        userId={userId}
        teams={teams}
      />
    </div>
  );
}
