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

  console.log("🔍 Fetching events for user:", userId);

  // Usar RPC para evitar problemas con RLS
  const { data, error } = await supabase
    .rpc("get_user_events", { p_user_id: userId });

  if (error) {
    console.error("❌ Error fetching events with RPC:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });

    // Si la función RPC no existe, intentar con query directa simplificada
    console.log("⚠️ RPC function not found, trying direct query...");

    // Query simplificada sin joins - primero obtener los eventos
    console.log("📊 Trying simplified query without joins...");

    // Obtener eventos creados por el usuario (sin join a teams)
    const { data: ownEvents, error: ownError } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", userId)
      .order("start_time", { ascending: true });

    if (ownError) {
      console.error("❌ Error loading own events:", ownError);
      console.log("⚠️ This is likely an RLS policy issue. Execute supabase-setup-completo.sql!");
    }

    console.log("📊 Own events loaded:", ownEvents?.length || 0);

    // Obtener los equipos del usuario
    const { data: userTeams } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", userId);

    const teamIds = userTeams?.map(tm => tm.team_id) || [];
    console.log("📊 User teams:", teamIds.length);

    let teamEvents: any[] = [];
    if (teamIds.length > 0) {
      // Obtener eventos de equipos (sin join a teams)
      const { data: teamEventsData, error: teamError } = await supabase
        .from("events")
        .select("*")
        .in("team_id", teamIds)
        .order("start_time", { ascending: true });

      if (teamError) {
        console.error("❌ Error loading team events:", teamError);
        console.log("⚠️ This is likely an RLS policy issue. Execute supabase-setup-completo.sql!");
      } else {
        teamEvents = teamEventsData || [];
        console.log("📊 Team events loaded:", teamEvents.length);
      }
    }

    // Combinar eventos propios y de equipo, eliminar duplicados
    const allEvents = [...(ownEvents || []), ...teamEvents];
    const uniqueEvents = Array.from(
      new Map(allEvents.map(event => [event.id, event])).values()
    );

    console.log("✅ Events loaded with simplified query:", uniqueEvents.length);

    // Ahora cargar los nombres de los equipos para los eventos que tienen team_id
    const eventsWithTeamIds = uniqueEvents.filter(e => e.team_id);
    const uniqueTeamIds = [...new Set(eventsWithTeamIds.map(e => e.team_id))];

    let teamNamesMap: Record<string, string> = {};
    if (uniqueTeamIds.length > 0) {
      const { data: teamsData } = await supabase
        .from("teams")
        .select("id, name")
        .in("id", uniqueTeamIds);

      if (teamsData) {
        teamNamesMap = Object.fromEntries(
          teamsData.map(t => [t.id, t.name])
        );
      }
    }

    return uniqueEvents.map((event: any) => ({
      ...event,
      team_name: event.team_id ? teamNamesMap[event.team_id] : undefined,
    }));
  }

  console.log("✅ Events loaded with RPC:", data?.length || 0);
  return data || [];
}

/**
 * Crea un nuevo evento
 */
export async function createEvent(
  eventData: EventInsert
): Promise<Event> {
  const supabase = createClient();

  console.log("📝 Creating event:", eventData);

  // Usar RPC para evitar problemas con RLS
  const { data, error } = await supabase
    .rpc("create_event", {
      p_title: eventData.title,
      p_description: eventData.description || null,
      p_start_time: eventData.start_time,
      p_end_time: eventData.end_time,
      p_all_day: eventData.all_day || false,
      p_team_id: eventData.team_id || null,
      p_created_by: eventData.created_by,
    })
    .single();

  if (error) {
    console.error("❌ Error creating event with RPC:", error);

    // Si la función RPC no existe, intentar con insert directo
    console.log("⚠️ RPC function not found, trying direct insert...");
    const { data: directData, error: directError } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (directError) {
      console.error("❌ Error with direct insert too:", directError);
      throw directError;
    }

    console.log("✅ Event created with direct insert:", directData);
    return directData;
  }

  console.log("✅ Event created with RPC:", data);
  return data as Event;
}

/**
 * Actualiza un evento existente
 */
export async function updateEvent(
  eventId: string,
  eventData: EventUpdate
): Promise<Event> {
  const supabase = createClient();

  console.log("📝 Updating event:", eventId, eventData);

  // Usar RPC para evitar problemas con RLS
  const { data, error } = await supabase
    .rpc("update_event", {
      p_event_id: eventId,
      p_title: eventData.title || "",
      p_description: eventData.description || null,
      p_start_time: eventData.start_time || new Date().toISOString(),
      p_end_time: eventData.end_time || new Date().toISOString(),
      p_all_day: eventData.all_day || false,
      p_team_id: eventData.team_id || null,
    })
    .single();

  if (error) {
    console.error("❌ Error updating event with RPC:", error);

    // Si la función RPC no existe, intentar con update directo
    console.log("⚠️ RPC function not found, trying direct update...");
    const { data: directData, error: directError } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", eventId)
      .select()
      .single();

    if (directError) {
      console.error("❌ Error with direct update too:", directError);
      throw directError;
    }

    console.log("✅ Event updated with direct update:", directData);
    return directData;
  }

  console.log("✅ Event updated with RPC:", data);
  return data as Event;
}

/**
 * Elimina un evento
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const supabase = createClient();

  console.log("🗑️ Deleting event:", eventId);

  // Usar RPC para evitar problemas con RLS
  const { error } = await supabase
    .rpc("delete_event", {
      p_event_id: eventId,
    });

  if (error) {
    console.error("❌ Error deleting event with RPC:", error);

    // Si la función RPC no existe, intentar con delete directo
    console.log("⚠️ RPC function not found, trying direct delete...");
    const { error: directError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (directError) {
      console.error("❌ Error with direct delete too:", directError);
      throw directError;
    }

    console.log("✅ Event deleted with direct delete");
    return;
  }

  console.log("✅ Event deleted with RPC");
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
