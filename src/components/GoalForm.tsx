import React, { useState } from 'react';
import { WeeklyGoal } from '@/lib/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getWeekStart, getWeekEnd, formatDate } from '@/lib/utils';

interface GoalFormProps {
  initialData?: WeeklyGoal | null;
  onSubmit: (data: { title: string; target_km: number; week_start: string }) => Promise<void>;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const currentWeekStart = initialData?.week_start || getWeekStart();
  const currentWeekEnd = getWeekEnd(new Date(`${currentWeekStart}T12:00:00`));

  const [title, setTitle] = useState(initialData?.title || '');
  const [targetKm, setTargetKm] = useState<number | string>(
    initialData?.target_km !== undefined ? initialData.target_km : ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Título da meta semanal é obrigatório';
    }
    if (!targetKm || Number(targetKm) <= 0) {
      newErrors.target_km = 'Volume alvo deve ser maior que 0 km';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        target_km: Number(targetKm),
        week_start: currentWeekStart,
      });
    } catch (err) {
      console.error('Error saving goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Week Header Telemetry */}
      <div className="bg-[#0A0A0A] border border-[#2A343D] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] text-[#8F9CA8] uppercase tracking-tactical block">
            PERÍODO OPERACIONAL // SEMANA ALVO
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF]">
            {formatDate(currentWeekStart)} — {formatDate(currentWeekEnd)}
          </span>
        </div>
        <div className="font-mono text-xs text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 border border-[#00FF66]/30 self-start sm:self-auto">
          INÍCIO: {currentWeekStart}
        </div>
      </div>

      {/* Goal Title */}
      <Input
        label="TÍTULO DA META / OBJETIVO PRINCIPAL"
        placeholder="Ex: Semana de Choque - 70km + Pico de Volume"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      {/* Target Volume */}
      <Input
        label="VOLUME SEMANAL ALVO (KM)"
        type="number"
        step="0.5"
        placeholder="Ex: 65"
        value={targetKm}
        onChange={(e) => setTargetKm(e.target.value)}
        error={errors.target_km}
        rightElement={<span className="text-[#00FF66] font-bold">KM</span>}
        required
        helperText="Quilometragem total somando todos os treinos da semana"
      />

      {/* Tactical Doctrine Box */}
      <div className="bg-[#1A1F24]/50 border-l-2 border-[#FFB800] p-4 text-xs font-mono space-y-1">
        <p className="text-[#FFB800] font-bold uppercase tracking-wider">
          DIRETIVA OPERACIONAL:
        </p>
        <p className="text-[#8F9CA8]">
          &quot;Seja específico. Objetivos claros = missões cumpridas. Metas semanais alinham o pelotão e garantem que o pico de 90km seja atingido com consistência.&quot;
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#2A343D]">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            CANCELAR
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="ml-auto px-8"
        >
          SALVAR ORDENS
        </Button>
      </div>
    </form>
  );
};
