import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase, Activity } from '@/lib/supabase';
import { ActivityForm } from '@/components/ActivityForm';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export const EditActivityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: activityId } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity | null>(null);
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

  const handleUpdate = async (formData: any) => {
    if (!user || !activityId) return;
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          title: formData.title,
          distance_km: formData.distance_km,
          duration_min: formData.duration_min || null,
          activity_type: formData.activity_type,
          scheduled_date: formData.scheduled_date,
          completed: formData.completed,
          notes: formData.notes?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      navigate('/activities');
    } catch (err: any) {
      console.error('Error updating activity:', err);
      setErrorMessage(err.message || 'Falha ao atualizar missão.');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      'ALERTA: Deseja realmente excluir definitivamente este registro de treino?'
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

      navigate('/activities');
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
        <div className="p-3 bg-[#FF2A3D]/10 border-l-2 border-[#FF2A3D] text-[#FF2A3D] font-mono text-xs">
          [ERRO]: {errorMessage}
        </div>
      )}

      {/* Form Container */}
      <Card variant="default" cornerTicks={true} className="p-6">
        {activity && (
          <ActivityForm
            initialData={activity}
            onSubmit={handleUpdate}
            onCancel={() => navigate('/activities')}
            onDelete={handleDelete}
            submitLabel="ATUALIZAR MISSÃO"
            isEdit={true}
          />
        )}
      </Card>
    </div>
  );
};
