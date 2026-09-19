export type ActivityType = 'tiro' | 'longo' | 'leve' | 'curto';

export type Profile = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type TrainingWeek = {
  id: string;
  user_id: string;
  week_start: string; // YYYY-MM-DD (Monday)
  week_end: string;   // YYYY-MM-DD (Sunday)
  title: string | null;
  target_km: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  user_id: string;
  week_id?: string;
  title: string;
  distance_km: number;
  duration_min: number | null;
  activity_type: ActivityType;
  scheduled_date: string; // YYYY-MM-DD
  completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WeeklyGoal = {
  id: string;
  user_id: string;
  title: string;
  target_km: number;
  week_start: string;
  created_at: string;
  updated_at: string;
};

export type TeamMember = Profile & {
  current_goal?: WeeklyGoal;
  upcoming_activities?: Activity[];
};

export type WeekSummary = {
  week: TrainingWeek;
  activities: Activity[];
  totalPlannedKm: number;
  totalCompletedKm: number;
  totalMissions: number;
  completedMissions: number;
  pendingMissions: number;
  isCurrentWeek: boolean;
};
