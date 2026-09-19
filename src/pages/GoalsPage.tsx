import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase, WeeklyGoal } from '@/lib/supabase';
import { getWeekStart } from '@/lib/utils';
import { GoalForm } from '@/components/GoalForm';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentGoal, setCurrentGoal] = useState<WeeklyGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentWeek = getWeekStart();

  const fetchCurrentGoal = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', currentWeek)
        .maybeSingle();

      if (error) {
        console.error('Error fetching weekly goal:', error);
      } else {
        setCurrentGoal(data);
      }
    } catch (err) {
      console.error('Exception fetching goal:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentWeek]);

  useEffect(() => {
    fetchCurrentGoal();
  }, [fetchCurrentGoal]);

  const handleSaveGoal = async (formData: { title: string; target_km: number; week_start: string }) => {
    if (!user) return;
    setStatusMessage(null);

    try {
      if (currentGoal?.id) {
        const { data, error } = await supabase
          .from('weekly_goals')
          .update({
            title: formData.title,
            target_km: formData.target_km,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentGoal.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setCurrentGoal(data);
        setStatusMessage({ type: 'success', text: 'Ordens semanais atualizadas com sucesso.' });
      } else {
        const { data, error } = await supabase
          .from('weekly_goals')
          .insert({
            user_id: user.id,
            title: formData.title,
            target_km: formData.target_km,
            week_start: formData.week_start,
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentGoal(data);
        setStatusMessage({ type: 'success', text: 'Novas ordens semanais estabelecidas!' });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('Error saving goal:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Falha ao salvar meta no banco de dados.',
      });
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
            PLANEJAMENTO ESTRATÉGICO
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFFFFF] tracking-heading uppercase mt-1">
          WEEKLY ORDERS // METAS DA SEMANA
        </h1>
      </div>

      {statusMessage && (
        <div
          className={`p-3 font-mono text-xs border-l-2 flex items-center space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]'
              : 'bg-[#FF2A3D]/10 border-[#FF2A3D] text-[#FF2A3D]'
          }`}
        >
          <span>{statusMessage.type === 'success' ? '[✓]' : '[!]'}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form Container */}
      <Card variant="default" cornerTicks={true} className="p-6">
        {isLoading ? (
          <Loading message="CARREGANDO METAS ATUAIS..." />
        ) : (
          <GoalForm
            initialData={currentGoal}
            onSubmit={handleSaveGoal}
            onCancel={() => navigate('/dashboard')}
          />
        )}
      </Card>
    </div>
  );
};
