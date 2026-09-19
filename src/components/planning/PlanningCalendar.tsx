import React, { useState } from 'react';
import { Activity, TrainingWeek, WeekSummary } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WeekGoalModal } from './WeekGoalModal';
import { QuickMissionModal } from './QuickMissionModal';
import {
  formatDate,
  formatFullDate,
  formatMonthYear,
  getWeekDays,
  getWeekNumber,
  formatDuration,
  calculatePace,
} from '@/lib/utils';

interface PlanningCalendarProps {
  weeksSummary: WeekSummary[];
  currentStartMonday: string;
  onNavigatePrev4: () => void;
  onNavigatePrev1: () => void;
  onNavigateNext1: () => void;
  onNavigateNext4: () => void;
  onNavigateToday: () => void;
  onToggleComplete: (activityId: string, currentStatus: boolean) => Promise<void>;
  onSaveMission: (activityData: any) => Promise<void>;
  onUpdateMission: (activityId: string, activityData: any) => Promise<void>;
  onDeleteMission: (activityId: string) => Promise<void>;
  onSaveWeekGoal: (weekStart: string, data: { title: string; target_km: number }) => Promise<void>;
  isLoading?: boolean;
}

export const PlanningCalendar: React.FC<PlanningCalendarProps> = ({
  weeksSummary,
  onNavigatePrev4,
  onNavigatePrev1,
  onNavigateNext1,
  onNavigateNext4,
  onNavigateToday,
  onToggleComplete,
  onSaveMission,
  onUpdateMission,
  onDeleteMission,
  onSaveWeekGoal,
}) => {
  // Modal states
  const [selectedWeekForGoal, setSelectedWeekForGoal] = useState<TrainingWeek | null>(null);
  const [selectedWeekForMission, setSelectedWeekForMission] = useState<TrainingWeek | null>(null);
  const [selectedDateForMission, setSelectedDateForMission] = useState<string | undefined>(undefined);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // Range calculations
  const firstWeek = weeksSummary[0];
  const lastWeek = weeksSummary[weeksSummary.length - 1];
  const startRangeStr = firstWeek ? formatDate(firstWeek.week.week_start) : '';
  const endRangeStr = lastWeek ? formatDate(lastWeek.week.week_end) : '';
  const monthYearStr = firstWeek ? formatMonthYear(firstWeek.week.week_start) : '';

  // Aggregate metrics across 4 weeks
  const totalPlannedKm = weeksSummary.reduce((acc, w) => acc + w.totalPlannedKm, 0);
  const totalCompletedKm = weeksSummary.reduce((acc, w) => acc + w.totalCompletedKm, 0);
  const totalMissions = weeksSummary.reduce((acc, w) => acc + w.totalMissions, 0);
  const completedMissions = weeksSummary.reduce((acc, w) => acc + w.completedMissions, 0);
  const overallProgress = totalPlannedKm > 0 ? Math.round((totalCompletedKm / totalPlannedKm) * 100) : 0;

  const handleOpenNewMission = (week: TrainingWeek, dateStr?: string) => {
    setActivityToEdit(null);
    setSelectedWeekForMission(week);
    setSelectedDateForMission(dateStr || week.week_start);
  };

  const handleOpenEditMission = (activity: Activity, week: TrainingWeek) => {
    setActivityToEdit(activity);
    setSelectedWeekForMission(week);
    setSelectedDateForMission(activity.scheduled_date);
  };

  const handleSaveMissionFromModal = async (formData: any) => {
    if (activityToEdit) {
      await onUpdateMission(activityToEdit.id, formData);
    } else {
      await onSaveMission(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTROL BAR & PERIOD NAVIGATION */}
      <div className="bg-[#14171A] border border-[#2A343D] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Period Display */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#00FF66] tracking-tactical uppercase">
              GRID DE OPERAÇÕES // VISÃO DE 4 SEMANAS
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFFFFF] tracking-heading uppercase flex items-center gap-3">
            <span>{startRangeStr} — {endRangeStr}</span>
            <span className="text-xs font-mono text-[#8F9CA8] bg-[#0A0A0A] px-2.5 py-1 border border-[#2A343D] uppercase hidden sm:inline-block">
              {monthYearStr}
            </span>
          </h2>
        </div>

        {/* Global Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-[#0A0A0A] border border-[#2A343D] px-3.5 py-2">
          <div>
            <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">TOTAL PLANEJADO</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#FFFFFF]">
              {totalPlannedKm.toFixed(1)} <span className="text-[10px] text-[#00FF66]">KM</span>
            </span>
          </div>
          <div className="h-6 w-px bg-[#2A343D]" />
          <div>
            <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">TOTAL CONCLUÍDO</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF66]">
              {totalCompletedKm.toFixed(1)} <span className="text-[10px] text-[#00FF66]">KM</span>
            </span>
          </div>
          <div className="h-6 w-px bg-[#2A343D]" />
          <div>
            <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">CUMPRIMENTO</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#FFB800]">
              {overallProgress}% ({completedMissions}/{totalMissions})
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 self-start lg:self-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigatePrev4}
            title="Voltar 4 semanas"
            className="px-2 sm:px-3 text-[10px] sm:text-xs"
          >
            « 4 SEM
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigatePrev1}
            title="Voltar 1 semana"
            className="px-2 sm:px-3 text-[10px] sm:text-xs"
          >
            ‹ 1 SEM
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToday}
            className="px-2.5 sm:px-4 text-[10px] sm:text-xs font-bold"
          >
            PERÍODO ATUAL
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateNext1}
            title="Avançar 1 semana"
            className="px-2 sm:px-3 text-[10px] sm:text-xs"
          >
            1 SEM ›
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateNext4}
            title="Avançar 4 semanas"
            className="px-2 sm:px-3 text-[10px] sm:text-xs"
          >
            4 SEM »
          </Button>
        </div>
      </div>

      {/* 2. FOUR CONSECUTIVE WEEKS LIST */}
      <div className="space-y-8">
        {weeksSummary.map((summary) => {
          const { week, activities, totalPlannedKm, totalCompletedKm, isCurrentWeek } = summary;
          const weekDays = getWeekDays(week.week_start);
          const weekNum = getWeekNumber(week.week_start);
          const targetKm = Number(week.target_km || 0);
          const weekProgress =
            targetKm > 0
              ? Math.min(100, Math.round((totalCompletedKm / targetKm) * 100))
              : totalPlannedKm > 0
              ? Math.min(100, Math.round((totalCompletedKm / totalPlannedKm) * 100))
              : 0;

          return (
            <div
              key={week.week_start}
              className={`border transition-all duration-200 relative ${
                isCurrentWeek
                  ? 'bg-[#14171A] border-[#00FF66] shadow-reticle'
                  : 'bg-[#14171A]/90 border-[#2A343D]'
              }`}
            >
              {/* Tactical Corner Crosshairs for Current Week */}
              {isCurrentWeek && (
                <>
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00FF66] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00FF66] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00FF66] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00FF66] pointer-events-none" />
                </>
              )}

              {/* WEEK HEADER & SUMMARY ROW */}
              <div className="p-4 sm:p-5 border-b border-[#2A343D] flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Week Meta */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-mono text-xs font-bold text-[#8F9CA8] uppercase tracking-wider">
                      SEMANA {weekNum} // {formatDate(week.week_start)} A {formatDate(week.week_end)}
                    </span>
                    {isCurrentWeek && (
                      <span className="bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-tactical flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-[#00FF66] inline-block animate-ping mr-1" />
                        SEMANA ATUAL
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FFFFFF] tracking-heading uppercase">
                    {week.title || `Semana de Treinamento #${weekNum}`}
                  </h3>
                </div>

                {/* Week Stats & Actions */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {/* Target vs Planned vs Completed */}
                  <div className="flex items-center space-x-4 bg-[#0A0A0A] border border-[#2A343D] px-3.5 py-2">
                    <div>
                      <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">
                        META ALVO
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#FFFFFF]">
                        {targetKm > 0 ? (
                          <>
                            {targetKm.toFixed(0)} <span className="text-[9px] text-[#00FF66]">KM</span>
                          </>
                        ) : (
                          <span className="text-[#8F9CA8] text-xs">NÃO DEFINIDA</span>
                        )}
                      </span>
                    </div>

                    <div className="h-6 w-px bg-[#2A343D]" />

                    <div>
                      <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">
                        PLANEJADO
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#FFFFFF]">
                        {totalPlannedKm.toFixed(1)} <span className="text-[9px] text-[#00FF66]">KM</span>
                      </span>
                    </div>

                    <div className="h-6 w-px bg-[#2A343D]" />

                    <div>
                      <span className="font-mono text-[9px] text-[#8F9CA8] uppercase block">
                        REALIZADO
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#00FF66]">
                        {totalCompletedKm.toFixed(1)} <span className="text-[9px] text-[#00FF66]">KM</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-28 hidden xl:block space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#8F9CA8]">
                      <span>EXECUÇÃO</span>
                      <span className="text-[#00FF66] font-bold">{weekProgress}%</span>
                    </div>
                    <div className="w-full bg-[#0A0A0A] h-2 border border-[#2A343D] overflow-hidden">
                      <div
                        className="bg-[#00FF66] h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, weekProgress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedWeekForGoal(week)}
                      className="text-[10px] h-8"
                    >
                      {targetKm > 0 ? 'EDITAR META' : '+ DEFINIR META'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenNewMission(week)}
                      className="text-[10px] h-8"
                    >
                      + MISSÃO
                    </Button>
                  </div>
                </div>
              </div>

              {/* 7-DAYS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-[#2A343D] bg-[#0A0A0A]/40">
                {weekDays.map((day) => {
                  const dayActivities = activities.filter((a) => a.scheduled_date === day.dateStr);
                  const dayTotalKm = dayActivities.reduce((acc, a) => acc + Number(a.distance_km || 0), 0);

                  return (
                    <div
                      key={day.dateStr}
                      className={`min-h-[160px] p-3 flex flex-col justify-between transition-colors ${
                        day.isToday
                          ? 'bg-[#1A1F24]/80 border-t-2 sm:border-t-0 sm:border-l-2 border-[#00FF66]'
                          : day.isPast
                          ? 'bg-[#0A0A0A]/60 opacity-90'
                          : 'bg-[#14171A]/40 hover:bg-[#14171A]'
                      }`}
                    >
                      {/* Day Header */}
                      <div>
                        <div className="flex items-center justify-between border-b border-[#2A343D]/60 pb-1.5 mb-2">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`font-mono text-xs font-black uppercase ${
                                day.isToday ? 'text-[#00FF66]' : 'text-[#FFFFFF]'
                              }`}
                            >
                              {day.dayName}
                            </span>
                            <span className="font-mono text-[11px] text-[#8F9CA8]">
                              {day.dayNumber}
                            </span>
                            {day.isToday && (
                              <span className="bg-[#00FF66] text-[#060709] font-mono text-[8px] font-black px-1 py-0.2 tracking-tight">
                                HOJE
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenNewMission(week, day.dateStr)}
                            className="text-[#8F9CA8] hover:text-[#00FF66] hover:bg-[#1A1F24] w-5 h-5 flex items-center justify-center font-mono text-xs transition-colors"
                            title={`Adicionar missão em ${formatFullDate(day.dateStr)}`}
                          >
                            +
                          </button>
                        </div>

                        {/* Missions in Day */}
                        <div className="space-y-2">
                          {dayActivities.map((act) => {
                            const isOverdue = !act.completed && day.isPast && !day.isToday;

                            return (
                              <div
                                key={act.id}
                                onClick={() => handleOpenEditMission(act, week)}
                                className={`group relative p-2 border cursor-pointer transition-all duration-150 text-left ${
                                  act.completed
                                    ? 'bg-[#14171A] border-[#00FF66]/40 hover:border-[#00FF66]'
                                    : isOverdue
                                    ? 'bg-[#14171A] border-[#FF2A3D]/50 hover:border-[#FF2A3D]'
                                    : 'bg-[#1A1F24] border-[#2A343D] hover:border-[#00FF66]'
                                }`}
                              >
                                {/* Left indicator bar */}
                                <div
                                  className={`absolute top-0 left-0 bottom-0 w-1 ${
                                    act.completed
                                      ? 'bg-[#00FF66]'
                                      : isOverdue
                                      ? 'bg-[#FF2A3D]'
                                      : 'bg-[#FFB800]'
                                  }`}
                                />

                                <div className="pl-1.5 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <Badge type={act.activity_type} size="sm" />
                                    <span className="font-mono text-xs font-extrabold text-[#FFFFFF]">
                                      {Number(act.distance_km).toFixed(1)}k
                                    </span>
                                  </div>

                                  <div className="font-mono text-[11px] font-bold text-[#FFFFFF] truncate leading-tight">
                                    {act.title}
                                  </div>

                                  {(act.duration_min || act.notes) && (
                                    <div className="flex items-center justify-between text-[9px] font-mono text-[#8F9CA8]">
                                      <span>{formatDuration(act.duration_min)}</span>
                                      <span>{calculatePace(act.distance_km, act.duration_min)}</span>
                                    </div>
                                  )}

                                  {/* Quick status toggle button */}
                                  <div className="pt-1 flex items-center justify-between border-t border-[#2A343D]/50 mt-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleComplete(act.id, act.completed);
                                      }}
                                      className={`font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase border transition-colors ${
                                        act.completed
                                          ? 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50 hover:bg-[#FF2A3D]/20 hover:text-[#FF2A3D] hover:border-[#FF2A3D]'
                                          : isOverdue
                                          ? 'bg-[#FF2A3D]/20 text-[#FF2A3D] border-[#FF2A3D]/50 hover:bg-[#00FF66]/20 hover:text-[#00FF66]'
                                          : 'bg-[#0A0A0A] text-[#8F9CA8] border-[#2A343D] hover:border-[#00FF66] hover:text-[#00FF66]'
                                      }`}
                                      title="Clique para alternar status"
                                    >
                                      {act.completed
                                        ? '✓ FEITO'
                                        : isOverdue
                                        ? '! ATRASADO'
                                        : '○ PENDENTE'}
                                    </button>

                                    <span className="font-mono text-[9px] text-[#8F9CA8] group-hover:text-[#00FF66] transition-colors">
                                      EDITAR ›
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Empty state / day footer */}
                      {dayActivities.length === 0 && (
                        <div
                          onClick={() => handleOpenNewMission(week, day.dateStr)}
                          className="mt-2 py-4 border border-dashed border-[#2A343D]/60 hover:border-[#00FF66]/60 hover:bg-[#1A1F24] cursor-pointer text-center group transition-all"
                          title="Clique para programar treino"
                        >
                          <span className="font-mono text-[10px] text-[#505D68] group-hover:text-[#00FF66] uppercase block">
                            + DESCANSO / PROGRAMAR
                          </span>
                        </div>
                      )}

                      {dayActivities.length > 0 && (
                        <div className="pt-2 text-right font-mono text-[10px] text-[#8F9CA8]">
                          TOTAL DIA:{' '}
                          <strong className="text-[#00FF66]">{dayTotalKm.toFixed(1)}k</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {selectedWeekForGoal && (
        <WeekGoalModal
          week={selectedWeekForGoal}
          isOpen={Boolean(selectedWeekForGoal)}
          onClose={() => setSelectedWeekForGoal(null)}
          onSave={onSaveWeekGoal}
        />
      )}

      {selectedWeekForMission && (
        <QuickMissionModal
          isOpen={Boolean(selectedWeekForMission)}
          onClose={() => {
            setSelectedWeekForMission(null);
            setActivityToEdit(null);
          }}
          targetWeek={selectedWeekForMission}
          initialDate={selectedDateForMission}
          activityToEdit={activityToEdit}
          onSave={handleSaveMissionFromModal}
          onDelete={onDeleteMission}
        />
      )}
    </div>
  );
};
