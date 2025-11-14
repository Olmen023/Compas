// Common types used across the application
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TeamType = "couple" | "team";
export type TeamRole = "owner" | "admin" | "member";
export type EventStatus = "pending" | "accepted" | "declined";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  created_by: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  profile?: Profile;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  team_id: string | null;
  created_at: string;
  updated_at: string;
  assigned_user?: Profile;
  team?: Team;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
  created_by: string;
  team_id: string | null;
  created_at: string;
  updated_at: string;
  team?: Team;
  attendees?: EventAttendee[];
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: EventStatus;
  profile?: Profile;
}
