import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase, Activity, TrainingWeek } from '@/lib/supabase';
import { PlanningService } from '@/lib/planningService';
import { ActivityForm, ActivityFormData } from '@/components/ActivityForm';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { getWeekStart, getWeekEnd, isDateInWeek } from '@/lib/utils';

export const EditActivityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: activityId } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [targetWeek, setTargetWeek] = useState<TrainingWeek | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchActivity = useCallback(async () => {
    if (!user || !activityId) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching activity:', error);
        setErrorMessage('Missão não encontrada ou acesso negado.');
      } else {
        setActivity(data);

        // Fetch or create associated week
        if (data.scheduled_date) {
          const weekStart = getWeekStart(data.scheduled_date);
          const weekEnd = getWeekEnd(data.scheduled_date);
          setTargetWeek({
            id: data.week_id || `week-${weekStart}`,
            user_id: user.id,
            week_start: weekStart,
            week_end: weekEnd,
            title: null,
            target_km: null,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Exception fetching activity:', err);
      setErrorMessage('Erro ao carregar os dados da missão.');
    } finally {
      setIsLoading(false);
    }
  }, [user, activityId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleUpdate = async (formData: ActivityFormData) => {
    if (!user || !activityId) return;
    setErrorMessage('');

    // If week is targeted, validate date is in week
    const currentWeekStart = getWeekStart(formData.scheduled_date);
    const currentWeekEnd = getWeekEnd(formData.scheduled_date);

    if (targetWeek && !isDateInWeek(formData.scheduled_date, targetWeek.week_start, targetWeek.week_end)) {
      // User changed date to another week, let's update targetWeek dynamically or block
      // If user deliberately changed date, let's ensure it maps to the new week cleanly:
      const confirmMove = window.confirm(
        `A nova data (${formData.scheduled_date}) pertence a outra semana (${currentWeekStart} a ${currentWeekEnd}). Deseja mover esta missão para a nova semana?`
      );
      if (!confirmMove) return;
    }

    const { error } = await PlanningService.updateMission(user.id, activityId, {
      title: formData.title,
      distance_km: Number(formData.distance_km),
      duration_min: formData.duration_min ? Number(formData.duration_min) : null,
      activity_type: formData.activity_type,
      scheduled_date: formData.scheduled_date,
      completed: formData.completed,
      notes: formData.notes,
      week_id: formData.week_id,
    });

    if (error) {
      setErrorMessage(error);
      return;
    }

    navigate('/planning');
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      'ALERTA OPERACIONAL: Deseja realmente excluir definitivamente este registro de missão?'
    );
    if (!confirm || !user || !activityId) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      navigate('/planning');
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      setErrorMessage(err.message || 'Falha ao excluir missão.');
    }
  };

  if (isLoading) {
    return <Loading message="RECUPERANDO REGISTRO DA MISSÃO..." />;
  }

  if (!activity && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto border border-[#FF2A3D] bg-[#14171A] p-8 text-center space-y-4">
        <h2 className="font-heading font-bold text-xl text-[#FF2A3D] uppercase">
          MISSÃO NÃO ENCONTRADA
        </h2>
        <p className="font-mono text-xs text-[#8F9CA8]">
          O registro solicitado não existe ou você não possui autorização operacional para modificá-lo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#2A343D] pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#FFB800] inline-block" />
          <span className="font-mono text-xs font-bold text-[#FFB800] tracking-tactical uppercase">
            MODIFICAÇÃO DE REGISTRO
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFFFFF] tracking-heading uppercase mt-1">
          EDITAR MISSÃO
        </h1>
      </div>

      {errorMessage && (
        <div className="p-3 bg-[#FF2A3D]/10 border-l-2 border-[#FF2A3D] text-[#FF2A3D] font-mono text-xs flex items-center space-x-2">
          <span>[!]</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <Card variant="default" cornerTicks={true} className="p-6">
        {activity && (
          <ActivityForm
            initialData={activity}
            targetWeek={targetWeek}
            onSubmit={handleUpdate}
            onCancel={() => navigate('/planning')}
            onDelete={handleDelete}
            submitLabel="ATUALIZAR MISSÃO"
            isEdit={true}
          />
        )}
      </Card>
    </div>
  );
};
