import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { PlanningService } from '@/lib/planningService';
import { ActivityForm, ActivityFormData } from '@/components/ActivityForm';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { TrainingWeek } from '@/lib/types';
import { getWeekStart, getWeekEnd, isDateInWeek } from '@/lib/utils';

export const NewActivityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [targetWeek, setTargetWeek] = useState<TrainingWeek | null>(null);

  const initialDate = searchParams.get('date');
  const initialWeekStart = searchParams.get('week_start') || (initialDate ? getWeekStart(initialDate) : null);

  useEffect(() => {
    if (initialWeekStart && user) {
      setTargetWeek({
        id: `week-${initialWeekStart}`,
        user_id: user.id,
        week_start: initialWeekStart,
        week_end: getWeekEnd(initialWeekStart),
        title: null,
        target_km: null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [initialWeekStart, user]);

  const handleCreate = async (formData: ActivityFormData) => {
    if (!user) return;
    setErrorMessage('');

    // Extra frontend check
    if (targetWeek && !isDateInWeek(formData.scheduled_date, targetWeek.week_start, targetWeek.week_end)) {
      setErrorMessage(
        `A data selecionada (${formData.scheduled_date}) está fora da semana vinculada (${targetWeek.week_start} até ${targetWeek.week_end}).`
      );
      return;
    }

    const { error } = await PlanningService.createMission(user.id, {
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

    // Return to planning if came with param, or activities list
    if (initialDate || initialWeekStart) {
      navigate('/planning');
    } else {
      navigate('/activities');
    }
  };

  if (!user) {
    return <Loading fullScreen message="AUTENTICANDO OPERADOR..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#2A343D] pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#00FF66] inline-block" />
          <span className="font-mono text-xs font-bold text-[#00FF66] tracking-tactical uppercase">
            NOVA ENTRADA OPERACIONAL
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFFFFF] tracking-heading uppercase mt-1">
          REGISTRAR NOVA MISSÃO
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
        <ActivityForm
          initialData={initialDate ? { scheduled_date: initialDate } : undefined}
          targetWeek={targetWeek}
          onSubmit={handleCreate}
          onCancel={() => (initialDate || initialWeekStart ? navigate('/planning') : navigate('/activities'))}
          submitLabel="SALVAR MISSÃO NO LOG"
        />
      </Card>
    </div>
  );
};
