import React from 'react';
import { TeamMember, WeeklyGoal } from '@/lib/types';
import { TeamCard } from './TeamCard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SkeletonCard } from './ui/Loading';
import { Link } from 'react-router-dom';

interface TeamMuralProps {
  members: TeamMember[];
  currentUserId?: string;
  currentUserGoal?: WeeklyGoal | null;
  isLoading?: boolean;
}

export const TeamMural: React.FC<TeamMuralProps> = ({
  members,
  currentUserId,
  currentUserGoal,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-[#14171A] border border-[#2A343D] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* User's Featured Weekly Order Banner */}
      <Card
        variant={currentUserGoal ? 'active' : 'default'}
        cornerTicks={true}
        className="overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-tactical text-[#00FF66]">
                SUAS ORDENS PARA ESTA SEMANA
              </span>
            </div>
            {currentUserGoal ? (
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#FFFFFF] tracking-heading uppercase">
                  {currentUserGoal.title}
                </h2>
                <p className="font-mono text-xs text-[#8F9CA8] mt-1">
                  META DESIGNADA:{' '}
                  <strong className="text-[#00FF66] font-bold">
                    {Number(currentUserGoal.target_km).toFixed(0)} KM
                  </strong>{' '}
                  TOTAL NA SEMANA
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-heading font-bold text-lg sm:text-xl text-[#FFB800] tracking-heading uppercase">
                  NENHUMA META REGISTRADA PARA ESTA SEMANA
                </h2>
                <p className="font-mono text-xs text-[#8F9CA8] mt-1">
                  Defina o objetivo de quilometragem semanal para sincronizar com o pelotão.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/goals">
              <Button variant="primary" size="md">
                {currentUserGoal ? 'ATUALIZAR META' : '+ DEFINIR META'}
              </Button>
            </Link>
            <Link to="/activities/new">
              <Button variant="outline" size="md">
                + NOVA MISSÃO
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Team Pelotão Manifest */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FFFFFF] tracking-heading uppercase">
              MURAL DO PELOTÃO ({members.length} OPERADORES)
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#8F9CA8] tracking-tactical hidden sm:inline">
            VISÃO TÁTICA SINCRONIZADA
          </span>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="border border-dashed border-[#2A343D] p-12 text-center bg-[#0A0A0A]">
            <p className="font-mono text-sm text-[#8F9CA8]">
              Nenhum outro operador registrado no pelotão.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMembers.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
