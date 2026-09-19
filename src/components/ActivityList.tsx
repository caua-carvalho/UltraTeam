import React, { useState } from 'react';
import { Activity } from '@/lib/types';
import { ActivityCard } from './ActivityCard';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

interface ActivityListProps {
  activities: Activity[];
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

type FilterType = 'ALL' | 'PENDING' | 'COMPLETE';

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onToggleComplete,
  onDelete,
}) => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'PENDING') return !activity.completed;
    if (filter === 'COMPLETE') return activity.completed;
    return true;
  });

  const totalKm = activities.reduce((acc, curr) => acc + Number(curr.distance_km || 0), 0);
  const completedKm = activities
    .filter((a) => a.completed)
    .reduce((acc, curr) => acc + Number(curr.distance_km || 0), 0);

  return (
    <div className="space-y-6">
      {/* Telemetry Summary & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#14171A] border border-[#2A343D] p-4">
        {/* Quick Stats */}
        <div className="flex items-center space-x-6">
          <div>
            <span className="font-mono text-[10px] text-[#8F9CA8] uppercase tracking-tactical block">
              TOTAL LOGADO
            </span>
            <span className="font-mono text-lg font-bold text-[#FFFFFF]">
              {totalKm.toFixed(1)} <span className="text-xs text-[#00FF66]">KM</span>
            </span>
          </div>

          <div className="h-8 w-px bg-[#2A343D]" />

          <div>
            <span className="font-mono text-[10px] text-[#8F9CA8] uppercase tracking-tactical block">
              CONCLUÍDO
            </span>
            <span className="font-mono text-lg font-bold text-[#00FF66]">
              {completedKm.toFixed(1)} <span className="text-xs text-[#00FF66]">KM</span>
            </span>
          </div>

          <div className="h-8 w-px bg-[#2A343D]" />

          <div>
            <span className="font-mono text-[10px] text-[#8F9CA8] uppercase tracking-tactical block">
              TOTAL MISSÕES
            </span>
            <span className="font-mono text-lg font-bold text-[#FFFFFF]">
              {activities.length}
            </span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1 border border-[#2A343D] bg-[#0A0A0A] p-1">
          {(['ALL', 'PENDING', 'COMPLETE'] as FilterType[]).map((f) => {
            const labels: Record<FilterType, string> = {
              ALL: 'TODAS',
              PENDING: 'PENDENTES',
              COMPLETE: 'CONCLUÍDAS',
            };

            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[11px] font-bold tracking-tactical uppercase px-3 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#00FF66] text-[#060709]'
                    : 'text-[#8F9CA8] hover:text-[#FFFFFF] hover:bg-[#14171A]'
                }`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Grid / List */}
      {filteredActivities.length === 0 ? (
        <div className="border border-dashed border-[#2A343D] bg-[#0A0A0A] p-10 text-center space-y-4">
          <div className="w-12 h-12 border border-[#2A343D] mx-auto flex items-center justify-center font-mono text-lg text-[#8F9CA8]">
            ∅
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg text-[#FFFFFF] uppercase">
              NENHUMA MISSÃO REGISTRADA
            </h4>
            <p className="font-mono text-xs text-[#8F9CA8] mt-1 max-w-sm mx-auto">
              Nenhum registro de treino encontrado para o filtro selecionado. Defina suas próximas sessões de corrida.
            </p>
          </div>
          <Link to="/activities/new">
            <Button variant="primary" size="md">
              + REGISTRAR PRIMEIRA MISSÃO
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
