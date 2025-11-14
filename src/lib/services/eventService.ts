import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export interface CalendarEvent extends Event {
  team_name?: string;
}

/**
 * Obtiene todos los eventos del usuario (propios y de equipos)
 */
export async function getUserEvents(userId: string): Promise<CalendarEvent[]> {
  const supabase = createClient();

  // Primero verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Authentication error:", authError);
    return []; // Retornar array vacío si no hay autenticación
  }

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      teams (
        name
      )
    `)
    .or(`created_by.eq.${userId},team_id.in.(select team_id from team_members where user_id = '${userId}')`)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching events:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    // No lanzar error, retornar array vacío
    return [];
  }

  // Mapear los datos para incluir el nombre del equipo
  return data?.map((event: any) => ({
    ...event,
    team_name: event.teams?.name,
  })) || [];
}

/**
 * Crea un nuevo evento
 */
export async function createEvent(
  eventData: EventInsert
): Promise<Event> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw error;
  }

  return data;
}

/**
 * Actualiza un evento existente
 */
export async function updateEvent(
  eventId: string,
  eventData: EventUpdate
): Promise<Event> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw error;
  }

  return data;
}

/**
 * Elimina un evento
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

/**
 * Obtiene los equipos del usuario para el selector
 */
export async function getUserTeams(userId: string) {
  const supabase = createClient();

  // Primero verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Authentication error:", authError);
    return []; // Retornar array vacío si no hay autenticación
  }

  const { data, error } = await supabase
    .from("team_members")
    .select(`
      team_id,
      teams (
        id,
        name,
        type
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user teams:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    // No lanzar error, retornar array vacío
    return [];
  }

  return data?.map((item: any) => item.teams).filter(Boolean) || [];
}

/**
 * Suscribirse a cambios en eventos en tiempo real
 */
export function subscribeToEvents(
  userId: string,
  callback: (event: CalendarEvent) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel("events-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
      },
      (payload) => {
        callback(payload.new as CalendarEvent);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
