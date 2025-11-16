import { createClient } from "@/lib/supabase/client";

export interface TeamDocument {
  id: string;
  team_id: string;
  title: string;
  url: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_avatar?: string;
}

export interface TeamDocumentInsert {
  team_id: string;
  title: string;
  url: string;
  description?: string;
  created_by: string;
}

/**
 * Obtiene todos los documentos de un equipo
 */
export async function getTeamDocuments(teamId: string): Promise<TeamDocument[]> {
  const supabase = createClient();

  console.log("📄 Fetching documents for team:", teamId);

  // Intentar usar RPC primero
  const { data, error } = await supabase
    .rpc("get_team_documents", { p_team_id: teamId });

  if (error) {
    console.error("❌ Error fetching documents with RPC:", error);

    // Fallback a query directa
    const { data: directData, error: directError } = await supabase
      .from("team_documents")
      .select(`
        *,
        profiles:created_by (
          full_name,
          avatar_url
        )
      `)
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    if (directError) {
      console.error("❌ Error with direct query:", directError);
      return [];
    }

    console.log("✅ Documents loaded with direct query:", directData?.length || 0);
    return (directData || []).map((doc: any) => ({
      ...doc,
      creator_name: doc.profiles?.full_name,
      creator_avatar: doc.profiles?.avatar_url,
    }));
  }

  console.log("✅ Documents loaded with RPC:", data?.length || 0);
  return data || [];
}

/**
 * Crea un nuevo documento
 */
export async function createDocument(
  documentData: TeamDocumentInsert
): Promise<TeamDocument> {
  const supabase = createClient();

  console.log("📝 Creating document:", documentData);

  const { data, error } = await supabase
    .from("team_documents")
    .insert(documentData)
    .select()
    .single();

  if (error) {
    console.error("❌ Error creating document:", error);
    throw error;
  }

  console.log("✅ Document created:", data);
  return data;
}

/**
 * Actualiza un documento existente
 */
export async function updateDocument(
  documentId: string,
  updates: Partial<TeamDocumentInsert>
): Promise<TeamDocument> {
  const supabase = createClient();

  console.log("📝 Updating document:", documentId, updates);

  const { data, error } = await supabase
    .from("team_documents")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", documentId)
    .select()
    .single();

  if (error) {
    console.error("❌ Error updating document:", error);
    throw error;
  }

  console.log("✅ Document updated:", data);
  return data;
}

/**
 * Elimina un documento
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const supabase = createClient();

  console.log("🗑️ Deleting document:", documentId);

  const { error } = await supabase
    .from("team_documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    console.error("❌ Error deleting document:", error);
    throw error;
  }

  console.log("✅ Document deleted");
}

/**
 * Suscribirse a cambios en documentos en tiempo real
 */
export function subscribeToDocuments(
  teamId: string,
  callback: () => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`team-documents-${teamId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "team_documents",
        filter: `team_id=eq.${teamId}`,
      },
      () => {
        console.log("📄 Document change detected");
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
