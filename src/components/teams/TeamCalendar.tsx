"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/components/calendar/CalendarView.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getUserEvents,
  subscribeToEvents,
  type CalendarEvent,
} from "@/lib/services/eventService";
import { EventDialog } from "@/components/calendar/EventDialog";
import styles from "./TeamCalendar.module.css";

const locales = { es };

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

interface TeamCalendarProps {
  teamId: string;
  userId: string;
}

export function TeamCalendar({ teamId, userId }: TeamCalendarProps) {
  const [events, setEvents] = useState<CalendarEventWithDates[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserEvents(userId);
      // Filtrar solo eventos de este equipo
      const teamEvents = data.filter(event => event.team_id === teamId);

      const eventsWithDates = teamEvents.map((event) => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));

      setEvents(eventsWithDates);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Error al cargar los eventos");
    } finally {
      setIsLoading(false);
    }
  }, [userId, teamId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(userId, loadEvents);
    return unsubscribe;
  }, [userId, loadEvents]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setSelectedSlot(slotInfo);
    setTimeout(() => setIsDialogOpen(true), 0);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEventWithDates) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setTimeout(() => setIsDialogOpen(true), 0);
  }, []);

  const handleEventSaved = useCallback(() => {
    loadEvents();
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  }, [loadEvents]);

  const EventComponent = ({ event }: { event: CalendarEventWithDates }) => {
    const startTime = format(event.start, "HH:mm", { locale: es });
    const endTime = format(event.end, "HH:mm", { locale: es });

    return (
      <div className={styles.eventContainer}>
        <div className={styles.eventTime}>
          {startTime} - {endTime}
        </div>
        <div className={styles.eventTitle}>{event.title}</div>
      </div>
    );
  };

  const eventStyleGetter = (event: CalendarEventWithDates) => {
    const style = {
      background: "#9333EA",
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
              Calendario del Equipo ({events.length} eventos)
            </h2>
            <p>
              Eventos compartidos con el equipo
            </p>
          </div>
          <Button onClick={() => {
            setSelectedEvent(null);
            setSelectedSlot(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>

        {/* Calendar */}
        <Card className={styles.calendarCard}>
          <div className={styles.calendarWrapper + " calendar-container"}>
            <Calendar
              localizer={localizer}
              events={events}
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
        </Card>
      </div>

      {/* Event Dialog - Pre-fill team_id */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
          setSelectedSlot(null);
        }}
        onSave={handleEventSaved}
        event={selectedEvent}
        slot={selectedSlot}
        userId={userId}
        teams={[{ id: teamId }]} // Solo este equipo
      />
    </>
  );
}
