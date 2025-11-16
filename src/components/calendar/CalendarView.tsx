"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";
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
import styles from "./CalendarView.module.css";

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

  // Componente personalizado adaptativo para todas las vistas
  const EventComponent = ({ event }: { event: CalendarEventWithDates }) => {
    // Para vistas de semana y día, mostrar título y descripción
    if (view === "week" || view === "day") {
      return (
        <div style={{ padding: '2px 4px', height: '100%', overflow: 'hidden' }}>
          <strong style={{ fontSize: '0.9em', display: 'block' }}>{event.title}</strong>
          {event.description && (
            <div style={{ fontSize: '0.75em', marginTop: '2px', opacity: 0.9 }}>
              {event.description}
            </div>
          )}
        </div>
      );
    }

    // Para vista mensual, mostrar tiempo y título
    const startTime = format(event.start, "HH:mm", { locale: es });
    const endTime = format(event.end, "HH:mm", { locale: es });

    return (
      <div className={styles.eventContainer}>
        <div className={styles.eventTime}>
          {startTime} - {endTime}
        </div>
        <div className={styles.eventTitle}>
          {event.title}
        </div>
      </div>
    );
  };

  const eventStyleGetter = (event: CalendarEventWithDates) => {
    // Colores con mejor contraste y más brillantes
    const eventColors = {
      team: "#9333EA", // Púrpura vibrante
      personal: "#0EA5E9", // Azul brillante
    };

    const style = {
      background: event.team_id ? eventColors.team : eventColors.personal,
      borderRadius: "6px",
      color: "#FFFFFF",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      display: "block",
      fontWeight: "600",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      padding: "2px",
    };
    return { style };
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <Card className={styles.toolbar + " glass shadow-lg hover-lift"}>
        <div className={styles.toolbarContent}>
          <div className={styles.toolbarLeft}>
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

          <div className={styles.toolbarRight}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("month")}
              className={`${styles.viewButton} ${
                view === "month"
                  ? `gradient-primary text-white ${styles.viewButtonActive}`
                  : "hover:bg-muted"
              }`}
            >
              Mes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("week")}
              className={`${styles.viewButton} ${
                view === "week"
                  ? `gradient-primary text-white ${styles.viewButtonActive}`
                  : "hover:bg-muted"
              }`}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("day")}
              className={`${styles.viewButton} ${
                view === "day"
                  ? `gradient-primary text-white ${styles.viewButtonActive}`
                  : "hover:bg-muted"
              }`}
            >
              Día
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <Card className={styles.calendarCard + " glass shadow-xl"}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Cargando eventos...</p>
          </div>
        ) : (
          <div className={styles.calendarWrapper + " calendar-container"}>
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
              components={{
                event: EventComponent,
              }}
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
          </div>
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
