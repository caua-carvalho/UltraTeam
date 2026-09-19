import { supabase, TrainingWeek, Activity, WeekSummary } from './supabase';
import { getWeekStart, getWeekEnd, addWeeks, formatLocalDateToISO, isDateInWeek } from './utils';

/**
 * Service to manage weekly training plans, weeks, and missions with strict integrity.
 */
export const PlanningService = {
  /**
   * Fetches training weeks and activities for a multi-week range (default 4 weeks)
   */
  async getMultiWeekOverview(
    userId: string,
    startMonday: string,
    weekCount: number = 4
  ): Promise<{ weeksSummary: WeekSummary[]; error: string | null }> {
    try {
      // 1. Calculate dates for the 4-week range
      const endMonday = addWeeks(startMonday, weekCount - 1);
      const endSunday = getWeekEnd(endMonday);

      // 2. Fetch existing training_weeks in this date range
      const { data: dbWeeks, error: weeksError } = await supabase
        .from('training_weeks')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start', startMonday)
        .lte('week_start', endMonday)
        .order('week_start', { ascending: true });

      if (weeksError) {
        console.error('Error fetching training weeks:', weeksError);
      }

      // Also check weekly_goals in case legacy records exist without training_weeks
      const { data: dbGoals } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start', startMonday)
        .lte('week_start', endMonday);

      const goalsMap = new Map<string, { title: string; target_km: number }>();
      (dbGoals || []).forEach((g) => {
        goalsMap.set(g.week_start, { title: g.title, target_km: Number(g.target_km) });
      });

      // 3. Fetch all activities for the user in this range
      const { data: dbActivities, error: actError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .gte('scheduled_date', startMonday)
        .lte('scheduled_date', endSunday)
        .order('scheduled_date', { ascending: true });

      if (actError) {
        console.error('Error fetching activities:', actError);
      }

      const existingWeeksMap = new Map<string, TrainingWeek>();
      (dbWeeks || []).forEach((w: TrainingWeek) => {
        existingWeeksMap.set(w.week_start, w);
      });

      const activities = dbActivities || [];
      const currentMonday = getWeekStart();

      // 4. Build exactly `weekCount` consecutive week summaries
      const weeksSummary: WeekSummary[] = [];

      for (let i = 0; i < weekCount; i++) {
        const weekStart = addWeeks(startMonday, i);
        const weekEnd = getWeekEnd(weekStart);

        let week = existingWeeksMap.get(weekStart);
        const fallbackGoal = goalsMap.get(weekStart);

        if (!week) {
          week = {
            id: `temp-${weekStart}`,
            user_id: userId,
            week_start: weekStart,
            week_end: weekEnd,
            title: fallbackGoal?.title || null,
            target_km: fallbackGoal?.target_km || null,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        } else if ((week.target_km === null || week.title === null) && fallbackGoal) {
          week = {
            ...week,
            title: week.title || fallbackGoal.title,
            target_km: week.target_km || fallbackGoal.target_km,
          };
        }

        // Filter activities that fall strictly within this week's start and end
        const weekActivities = activities.filter((act) =>
          isDateInWeek(act.scheduled_date, weekStart, weekEnd)
        );

        const totalPlannedKm = weekActivities.reduce(
          (acc, a) => acc + (Number(a.distance_km) || 0),
          0
        );
        const totalCompletedKm = weekActivities
          .filter((a) => a.completed)
          .reduce((acc, a) => acc + (Number(a.distance_km) || 0), 0);

        const totalMissions = weekActivities.length;
        const completedMissions = weekActivities.filter((a) => a.completed).length;
        const pendingMissions = totalMissions - completedMissions;

        weeksSummary.push({
          week,
          activities: weekActivities,
          totalPlannedKm,
          totalCompletedKm,
          totalMissions,
          completedMissions,
          pendingMissions,
          isCurrentWeek: weekStart === currentMonday,
        });
      }

      return { weeksSummary, error: null };
    } catch (err: any) {
      console.error('Exception in getMultiWeekOverview:', err);
      return { weeksSummary: [], error: err.message || 'Erro ao carregar telemetria semanal.' };
    }
  },

  /**
   * Ensures a week record exists in training_weeks table for a user and date
   */
  async ensureTrainingWeek(userId: string, weekStart: string): Promise<TrainingWeek> {
    const weekEnd = getWeekEnd(weekStart);

    const { data: existing, error: findError } = await supabase
      .from('training_weeks')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // Create week
    const { data: created, error: createError } = await supabase
      .from('training_weeks')
      .insert({
        user_id: userId,
        week_start: weekStart,
        week_end: weekEnd,
        title: `Semana ${weekStart.split('-').slice(1).reverse().join('/')}`,
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create training week, trying to query again:', createError);
      // In case of race condition conflict
      const { data: retry } = await supabase
        .from('training_weeks')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .single();
      if (retry) return retry;
      throw createError;
    }

    return created;
  },

  /**
   * Creates a mission with strict week and date validation
   */
  async createMission(
    userId: string,
    activityData: {
      title: string;
      distance_km: number;
      duration_min?: number | null;
      activity_type: string;
      scheduled_date: string;
      completed: boolean;
      notes?: string | null;
      week_id?: string;
    }
  ): Promise<{ data: Activity | null; error: string | null }> {
    try {
      const scheduledDate = activityData.scheduled_date;
      const expectedWeekStart = getWeekStart(scheduledDate);
      const expectedWeekEnd = getWeekEnd(scheduledDate);

      // Validate date inside week
      if (!isDateInWeek(scheduledDate, expectedWeekStart, expectedWeekEnd)) {
        return {
          data: null,
          error: `A data selecionada (${scheduledDate}) não pertence à semana informada (${expectedWeekStart} a ${expectedWeekEnd}).`,
        };
      }

      // Ensure week exists in database
      const week = await this.ensureTrainingWeek(userId, expectedWeekStart);

      // Save activity
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: userId,
          week_id: week.id,
          title: activityData.title.trim(),
          distance_km: Number(activityData.distance_km),
          duration_min: activityData.duration_min ? Number(activityData.duration_min) : null,
          activity_type: activityData.activity_type,
          scheduled_date: scheduledDate,
          completed: Boolean(activityData.completed),
          notes: activityData.notes?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating mission:', err);
      return {
        data: null,
        error: err.message || 'Falha ao gravar missão no banco de dados.',
      };
    }
  },

  /**
   * Updates an existing mission with date and week verification
   */
  async updateMission(
    userId: string,
    activityId: string,
    activityData: {
      title: string;
      distance_km: number;
      duration_min?: number | null;
      activity_type: string;
      scheduled_date: string;
      completed: boolean;
      notes?: string | null;
      week_id?: string;
    }
  ): Promise<{ data: Activity | null; error: string | null }> {
    try {
      const scheduledDate = activityData.scheduled_date;
      const expectedWeekStart = getWeekStart(scheduledDate);
      const expectedWeekEnd = getWeekEnd(scheduledDate);

      if (!isDateInWeek(scheduledDate, expectedWeekStart, expectedWeekEnd)) {
        return {
          data: null,
          error: `A data selecionada (${scheduledDate}) não pertence ao intervalo da semana (${expectedWeekStart} a ${expectedWeekEnd}).`,
        };
      }

      // Ensure week exists
      const week = await this.ensureTrainingWeek(userId, expectedWeekStart);

      const { data, error } = await supabase
        .from('activities')
        .update({
          week_id: week.id,
          title: activityData.title.trim(),
          distance_km: Number(activityData.distance_km),
          duration_min: activityData.duration_min ? Number(activityData.duration_min) : null,
          activity_type: activityData.activity_type,
          scheduled_date: scheduledDate,
          completed: Boolean(activityData.completed),
          notes: activityData.notes?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activityId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating mission:', err);
      return {
        data: null,
        error: err.message || 'Falha ao atualizar registro da missão.',
      };
    }
  },

  /**
   * Updates or creates weekly goal & week title/target
   */
  async saveWeekGoal(
    userId: string,
    weekStart: string,
    data: { title: string; target_km: number; notes?: string }
  ): Promise<{ data: TrainingWeek | null; error: string | null }> {
    try {
      const weekEnd = getWeekEnd(weekStart);

      const { data: updatedWeek, error } = await supabase
        .from('training_weeks')
        .upsert(
          {
            user_id: userId,
            week_start: weekStart,
            week_end: weekEnd,
            title: data.title.trim(),
            target_km: Number(data.target_km),
            notes: data.notes?.trim() || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id, week_start' }
        )
        .select()
        .single();

      if (error) throw error;

      // Also upsert into weekly_goals for backwards compatibility
      await supabase.from('weekly_goals').upsert(
        {
          user_id: userId,
          week_start: weekStart,
          title: data.title.trim(),
          target_km: Number(data.target_km),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, week_start' }
      );

      return { data: updatedWeek, error: null };
    } catch (err: any) {
      console.error('Error saving weekly goal:', err);
      return {
        data: null,
        error: err.message || 'Falha ao salvar meta semanal.',
      };
    }
  },
};
