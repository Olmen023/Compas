import { CalendarView } from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tus eventos y coordina actividades con tu equipo
        </p>
      </div>

      <CalendarView />
    </div>
  );
}
