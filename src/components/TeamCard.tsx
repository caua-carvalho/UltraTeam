import React from 'react';
import { TeamMember } from '@/lib/types';
import { Badge } from './ui/Badge';
import { formatDate } from '@/lib/utils';

interface TeamCardProps {
  member: TeamMember;
  isCurrentUser?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member, isCurrentUser = false }) => {
  const goal = member.current_goal;
  const activities = member.upcoming_activities || [];
  const completedActivities = activities.filter((a) => a.completed);

  return (
    <div
      className={`relative border flex flex-col justify-between transition-all duration-150 ${
        isCurrentUser
          ? 'bg-[#14171A] border-[#00FF66] shadow-reticle'
          : 'bg-[#14171A] border-[#2A343D] hover:border-[#8F9CA8]'
      }`}
    >
      {/* Corner crosshairs */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF66] pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF66] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF66] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF66] pointer-events-none" />

      {/* Card Header: Member Info */}
      <div className="p-4 border-b border-[#2A343D]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-bold text-lg text-[#FFFFFF] tracking-heading uppercase">
                {member.name}
              </h3>
              {isCurrentUser && (
                <span className="font-mono text-[9px] bg-[#00FF66]/20 text-[#00FF66] px-1.5 py-0.5 border border-[#00FF66]/40 font-bold uppercase">
                  VOCÊ
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-[#8F9CA8] truncate">
              {member.email}
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-[#00FF66] block tracking-tactical">
              OPERADOR ATIVO
            </span>
          </div>
        </div>
      </div>

      {/* Goal Section */}
      <div className="p-4 bg-[#0A0A0A]/70 border-b border-[#2A343D]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] font-bold text-[#8F9CA8] tracking-tactical uppercase">
            META DA SEMANA
          </span>
          {goal ? (
            <span className="font-mono text-xs font-bold text-[#00FF66]">
              {Number(goal.target_km).toFixed(0)} KM ALVO
            </span>
          ) : (
            <span className="font-mono text-[10px] text-[#FFB800]">
              SEM META DEFINIDA
            </span>
          )}
        </div>

        {goal ? (
          <div className="bg-[#14171A] border border-[#2A343D] p-2.5">
            <p className="font-mono text-xs text-[#FFFFFF] font-medium truncate">
              {goal.title}
            </p>
          </div>
        ) : (
          <div className="p-2 border border-dashed border-[#2A343D] text-center">
            <p className="font-mono text-[11px] text-[#8F9CA8]">
              Nenhuma ordem cadastrada para esta semana
            </p>
          </div>
        )}
      </div>

      {/* Upcoming Activities Feed */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold text-[#8F9CA8] tracking-tactical uppercase">
              PRÓXIMAS MISSÕES ({activities.length})
            </span>
            <span className="font-mono text-[10px] text-[#8F9CA8]">
              {completedActivities.length}/{activities.length} REALIZADOS
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="py-4 text-center border border-[#2A343D]/60 bg-[#0A0A0A]">
              <p className="font-mono text-[11px] text-[#8F9CA8]">
                Nenhuma missão programada
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className={`p-2 border flex items-center justify-between gap-2 text-xs transition-colors ${
                    act.completed
                      ? 'bg-[#1A1F24]/50 border-[#2A343D]/60 opacity-80'
                      : 'bg-[#14171A] border-[#2A343D]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="font-mono text-[10px] text-[#8F9CA8]">
                        {formatDate(act.scheduled_date)}
                      </span>
                      <Badge type={act.activity_type} size="sm" />
                    </div>
                    <div className="font-mono text-xs text-[#FFFFFF] font-bold truncate">
                      {act.title}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xs font-bold text-[#FFFFFF]">
                      {Number(act.distance_km).toFixed(1)}k
                    </div>
                    <span
                      className={`font-mono text-[9px] font-bold block ${
                        act.completed ? 'text-[#00FF66]' : 'text-[#FFB800]'
                      }`}
                    >
                      {act.completed ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
