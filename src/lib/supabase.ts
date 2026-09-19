import { createClient } from '@supabase/supabase-js';

// Support both Vite env and fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { Profile, Activity, WeeklyGoal, TrainingWeek, TeamMember, ActivityType, WeekSummary } from './types';
