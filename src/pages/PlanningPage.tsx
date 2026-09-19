import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { PlanningService } from '@/lib/planningService';
import { supabase, WeekSummary } from '@/lib/supabase';
import { getWeekStart, addWeeks } from '@/lib/utils';
import { PlanningCalendar } from '@/components/planning/PlanningCalendar';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

export const PlanningPage: React.FC = () => {
  const { user } = useAuth();
  const [startMonday, setStartMonday] = useState<string>(getWeekStart());
  const [weeksSummary, setWeeksSummary] = useState<WeekSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchPlanningData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { weeksSummary: summaries, error } = await PlanningService.getMultiWeekOverview(
        user.id,
        startMonday,
        4
      );

      if (error) {
        setStatusMessage({ type: 'error', text: error });
      } else {
        setWeeksSummary(summaries);
      }
    } catch (err: any) {
      console.error('Error in fetchPlanningData:', err);
      setStatusMessage({
        type: 'error',
        text: 'Falha ao sincronizar telemetria de planejamento.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, startMonday]);

  useEffect(() => {
    fetchPlanningData();
  }, [fetchPlanningData]);

  // Navigation handlers
  const handleNavigatePrev4 = () => setStartMonday((prev) => addWeeks(prev, -4));
  const handleNavigatePrev1 = () => setStartMonday((prev) => addWeeks(prev, -1));
  const handleNavigateNext1 = () => setStartMonday((prev) => addWeeks(prev, 1));
  const handleNavigateNext4 = () => setStartMonday((prev) => addWeeks(prev, 4));
  const handleNavigateToday = () => setStartMonday(getWeekStart());

  // Quick toggle completion
  const handleToggleComplete = async (activityId: string, currentStatus: boolean) => {
    if (!user) return;

    // Optimistic UI update
    setWeeksSummary((prev) =>
      prev.map((summary) => ({
        ...summary,
        activities: summary.activities.map((a) =>
          a.id === activityId ? { ...a, completed: !currentStatus } : a
        ),
        totalCompletedKm: summary.activities
          .map((a) => (a.id === activityId ? { ...a, completed: !currentStatus } : a))
          .filter((a) => a.completed)
          .reduce((acc, a) => acc + Number(a.distance_km || 0), 0),
        completedMissions: summary.activities
          .map((a) => (a.id === activityId ? { ...a, completed: !currentStatus } : a))
          .filter((a) => a.completed).length,
      }))
    );

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          completed: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error toggling activity:', err);
      setStatusMessage({
        type: 'error',
        text: 'Erro ao atualizar status da missão no banco de dados.',
      });
      fetchPlanningData();
    }
  };

  // Create mission
  const handleSaveMission = async (formData: any) => {
    if (!user) return;
    setStatusMessage(null);

    const { error } = await PlanningService.createMission(user.id, formData);
    if (error) {
      setStatusMessage({ type: 'error', text: error });
      throw new Error(error);
    }

    setStatusMessage({ type: 'success', text: 'Missão registrada com sucesso no plano!' });
    await fetchPlanningData();
  };

  // Update mission
  const handleUpdateMission = async (activityId: string, formData: any) => {
    if (!user) return;
    setStatusMessage(null);

    const { error } = await PlanningService.updateMission(user.id, activityId, formData);
    if (error) {
      setStatusMessage({ type: 'error', text: error });
      throw new Error(error);
    }

    setStatusMessage({ type: 'success', text: 'Registro da missão atualizado com sucesso!' });
    await fetchPlanningData();
  };

  // Delete mission
  const handleDeleteMission = async (activityId: string) => {
    if (!user) return;
    setStatusMessage(null);

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;
      setStatusMessage({ type: 'success', text: 'Missão removida do planejamento.' });
      await fetchPlanningData();
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      setStatusMessage({ type: 'error', text: 'Falha ao excluir missão.' });
    }
  };

  // Save week goal
  const handleSaveWeekGoal = async (
    weekStart: string,
    data: { title: string; target_km: number }
  ) => {
    if (!user) return;
    setStatusMessage(null);

    const { error } = await PlanningService.saveWeekGoal(user.id, weekStart, data);
    if (error) {
      setStatusMessage({ type: 'error', text: error });
      throw new Error(error);
    }

    setStatusMessage({ type: 'success', text: 'Meta e diretiva da semana salvas com sucesso!' });
    await fetchPlanningData();
  };

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
              PLANEJAMENTO OPERACIONAL // CALENDÁRIO
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FFFFFF] tracking-heading uppercase mt-1">
            CRONOGRAMA DE MISSÕES
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/activities/new">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              + NOVA MISSÃO
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3 font-mono text-xs border-l-2 flex items-center justify-between space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]'
              : 'bg-[#FF2A3D]/10 border-[#FF2A3D] text-[#FF2A3D]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{statusMessage.type === 'success' ? '[✓]' : '[!]'}</span>
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-current opacity-70 hover:opacity-100 font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Multi-Week Planning Grid */}
      {isLoading && weeksSummary.length === 0 ? (
        <Loading message="SINCRONIZANDO CRONOGRAMA DE 4 SEMANAS..." />
      ) : (
        <PlanningCalendar
          weeksSummary={weeksSummary}
          currentStartMonday={startMonday}
          onNavigatePrev4={handleNavigatePrev4}
          onNavigatePrev1={handleNavigatePrev1}
          onNavigateNext1={handleNavigateNext1}
          onNavigateNext4={handleNavigateNext4}
          onNavigateToday={handleNavigateToday}
          onToggleComplete={handleToggleComplete}
          onSaveMission={handleSaveMission}
          onUpdateMission={handleUpdateMission}
          onDeleteMission={handleDeleteMission}
          onSaveWeekGoal={handleSaveWeekGoal}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
