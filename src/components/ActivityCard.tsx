import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '@/lib/types';
import { Badge } from './ui/Badge';
import { formatDate, formatDuration, calculatePace } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggleComplete,
  onDelete,
  showActions = true,
}) => {
  return (
    <div
      className={`relative border p-4 transition-all duration-150 ${
        activity.completed
          ? 'bg-[#14171A]/60 border-[#2A343D]'
          : 'bg-[#14171A] border-[#2A343D] hover:border-[#8F9CA8]'
      }`}
    >
      {/* Corner indicator */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full ${
          activity.completed ? 'bg-[#00FF66]' : 'bg-[#FFB800]'
        }`}
      />

      <div className="pl-2">
        {/* Top Header: Date, Status, Type */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#8F9CA8] tracking-wider">
              {formatDate(activity.scheduled_date)}
            </span>
            <Badge type={activity.activity_type} size="sm" />
          </div>

          <div className="flex items-center space-x-2">
            {onToggleComplete ? (
              <button
                onClick={() => onToggleComplete(activity.id, activity.completed)}
                className={`font-mono text-[10px] px-2 py-0.5 font-bold tracking-tactical uppercase border flex items-center space-x-1.5 transition-colors ${
                  activity.completed
                    ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]'
                    : 'bg-[#2A343D]/30 text-[#8F9CA8] border-[#2A343D] hover:border-[#00FF66] hover:text-[#00FF66]'
                }`}
              >
                <span>{activity.completed ? '✓ CONCLUÍDO' : '○ PENDENTE'}</span>
              </button>
            ) : (
              <Badge variant={activity.completed ? 'green' : 'amber'} size="sm">
                {activity.completed ? 'CONCLUÍDO' : 'PENDENTE'}
              </Badge>
            )}
          </div>
        </div>

        {/* Activity Title */}
        <h4 className="font-heading font-bold text-base sm:text-lg text-[#FFFFFF] tracking-heading uppercase leading-tight mb-3">
          {activity.title}
        </h4>

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#0A0A0A] border border-[#2A343D] mb-3">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-tactical text-[#8F9CA8]">
              DISTÂNCIA
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF]">
              {Number(activity.distance_km).toFixed(1)} <span className="text-[10px] text-[#00FF66]">KM</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-tactical text-[#8F9CA8]">
              TEMPO
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF]">
              {formatDuration(activity.duration_min)}
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-tactical text-[#8F9CA8]">
              RITMO
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF]">
              {calculatePace(activity.distance_km, activity.duration_min)}
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        {activity.notes && (
          <div className="mb-3 text-xs font-sans text-[#BDC8D3] bg-[#1A1F24]/50 border-l-2 border-[#8F9CA8] p-2 italic">
            &quot;{activity.notes}&quot;
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#2A343D]">
            <Link
              to={`/activities/${activity.id}`}
              className="font-mono text-[11px] font-bold text-[#8F9CA8] hover:text-[#FFFFFF] uppercase tracking-tactical px-2 py-1 hover:bg-[#1A1F24]"
            >
              EDITAR
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(activity.id)}
                className="font-mono text-[11px] font-bold text-[#FF2A3D] hover:text-[#ff6675] uppercase tracking-tactical px-2 py-1 hover:bg-[#FF2A3D]/10"
              >
                EXCLUIR
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
