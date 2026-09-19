import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase, TeamMember, WeeklyGoal, Activity } from '@/lib/supabase';
import { getWeekStart } from '@/lib/utils';
import { TeamMural } from '@/components/TeamMural';
import { Loading } from '@/components/ui/Loading';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUserGoal, setCurrentUserGoal] = useState<WeeklyGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const currentWeek = getWeekStart();

      // 1. Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const allProfiles = profiles || [];

      // Ensure current user is in profiles list
      const hasCurrentUser = allProfiles.some((p) => p.id === user.id);
      if (!hasCurrentUser && profile) {
        allProfiles.push(profile);
      }

      const userIds = allProfiles.map((p) => p.id);

      // 2. Fetch weekly goals for all team members for current week
      const { data: goals, error: goalsError } = await supabase
        .from('weekly_goals')
        .select('*')
        .in('user_id', userIds.length > 0 ? userIds : [user.id])
        .eq('week_start', currentWeek);

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
      }

      // 3. Fetch upcoming/recent activities for all team members
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .in('user_id', userIds.length > 0 ? userIds : [user.id])
        .order('scheduled_date', { ascending: false })
        .limit(50);

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      }

      // 4. Combine into TeamMember structures
      const goalsMap = new Map<string, WeeklyGoal>();
      (goals || []).forEach((g: WeeklyGoal) => {
        goalsMap.set(g.user_id, g);
      });

      const activitiesMap = new Map<string, Activity[]>();
      (activities || []).forEach((a: Activity) => {
        const userActs = activitiesMap.get(a.user_id) || [];
        userActs.push(a);
        activitiesMap.set(a.user_id, userActs);
      });

      const assembledMembers: TeamMember[] = allProfiles.map((prof) => ({
        ...prof,
        current_goal: goalsMap.get(prof.id),
        upcoming_activities: activitiesMap.get(prof.id) || [],
      }));

      setTeamMembers(assembledMembers);

      const userGoal = goalsMap.get(user.id) || null;
      setCurrentUserGoal(userGoal);
    } catch (err) {
      console.error('Dashboard telemetry exception:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!user) {
    return <Loading fullScreen message="AUTENTICANDO OPERADOR..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A343D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] inline-block" />
            <span className="font-mono text-xs font-bold text-[#00FF66] tracking-tactical uppercase">
              CENTRAL DE COMANDO
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FFFFFF] tracking-heading uppercase mt-1">
            WAR ROOM // MURAL DA EQUIPE
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="font-mono text-xs text-[#8F9CA8]">
            <div>
              OBJETIVO FINAL: <strong className="text-[#FFFFFF]">90 KM</strong>
            </div>
            <div className="text-[10px] text-[#00FF66]">PREPARAÇÃO COLETIVA</div>
          </div>
        </div>
      </div>

      {/* Main Team Mural Display */}
      <TeamMural
        members={teamMembers}
        currentUserId={user.id}
        currentUserGoal={currentUserGoal}
        isLoading={isLoading}
      />
    </div>
  );
};
