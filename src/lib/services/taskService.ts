import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

// Get all tasks for a user usando RPC (evita recursión RLS)
export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("get_user_tasks", { p_user_id: userId });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data || [];
}

// Get tasks by team
export async function getTasksByTeam(teamId: string): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching team tasks:", error);
    throw error;
  }

  return data || [];
}

// Create a new task usando RPC (evita problemas con RLS)
export async function createTask(task: TaskInsert): Promise<Task> {
  const supabase = createClient();

  const { data, error} = await supabase
    .rpc("create_task", {
      p_title: task.title,
      p_description: task.description || null,
      p_status: task.status || "todo",
      p_priority: task.priority || "medium",
      p_due_date: task.due_date || null,
      p_team_id: task.team_id || null,
      p_assigned_to: task.assigned_to || null,
      p_created_by: task.created_by,
    })
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return data as Task;
}

// Update a task
export async function updateTask(
  taskId: string,
  updates: TaskUpdate
): Promise<Task> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  return data;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// Toggle task status
export async function toggleTaskStatus(task: Task): Promise<Task> {
  const newStatus = task.status === "done" ? "todo" : "done";
  return updateTask(task.id, { status: newStatus });
}
