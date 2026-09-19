import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase, Activity } from '@/lib/supabase';
import { ActivityList } from '@/components/ActivityList';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

export const ActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data || []);
      }
    } catch (err) {
      console.error('Exception fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !currentStatus } : a))
    );

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          completed: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Failed to update activity status:', error);
        fetchActivities();
      }
    } catch (err) {
      console.error('Error updating activity status:', err);
      fetchActivities();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'CONFIRMAÇÃO OPERACIONAL: Deseja realmente excluir esta missão?'
    );
    if (!confirmDelete) return;

    setActivities((prev) => prev.filter((a) => a.id !== id));

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete activity:', error);
        fetchActivities();
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
      fetchActivities();
    }
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
              REGISTRO DE OPERAÇÕES
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FFFFFF] tracking-heading uppercase mt-1">
            MISSION LOG // SEUS TREINOS
          </h1>
        </div>

        <Link to="/activities/new">
          <Button variant="primary" size="md" className="w-full sm:w-auto">
            + NOVA MISSÃO
          </Button>
        </Link>
      </div>

      {/* Activities List */}
      {isLoading ? (
        <Loading message="CARREGANDO MISSÕES REGISTRADAS..." />
      ) : (
        <ActivityList
          activities={activities}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
