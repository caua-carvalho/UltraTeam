import React, { useState } from 'react';
import { TrainingWeek } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface WeekGoalModalProps {
  week: TrainingWeek;
  isOpen: boolean;
  onClose: () => void;
  onSave: (weekStart: string, data: { title: string; target_km: number }) => Promise<void>;
}

export const WeekGoalModal: React.FC<WeekGoalModalProps> = ({
  week,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(week.title || '');
  const [targetKm, setTargetKm] = useState<number | string>(
    week.target_km !== null && week.target_km !== undefined ? week.target_km : ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Título da meta é obrigatório';
    }
    if (!targetKm || Number(targetKm) <= 0) {
      errs.target_km = 'Volume alvo deve ser maior que 0 km';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(week.week_start, {
        title: title.trim(),
        target_km: Number(targetKm),
      });
      onClose();
    } catch (err) {
      console.error('Error in modal saving goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060709]/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14171A] border border-[#00FF66] shadow-reticle p-6 space-y-6">
        {/* Tactical Corner Crosshairs */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FF66]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00FF66]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00FF66]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FF66]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A343D] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse" />
              <span className="font-mono text-[10px] text-[#00FF66] uppercase tracking-tactical">
                ORDENS DA SEMANA
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FFFFFF] tracking-heading uppercase mt-0.5">
              META // {formatDate(week.week_start)} — {formatDate(week.week_end)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-sm text-[#8F9CA8] hover:text-[#FFFFFF] p-1.5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="DIRETIVA / TÍTULO DA SEMANA"
            placeholder="Ex: Semana de Choque - 65km"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <Input
            label="VOLUME ALVO DA SEMANA (KM)"
            type="number"
            step="0.5"
            placeholder="Ex: 60"
            value={targetKm}
            onChange={(e) => setTargetKm(e.target.value)}
            error={errors.target_km}
            rightElement={<span className="text-[#00FF66] font-bold">KM</span>}
            required
          />

          <div className="bg-[#0A0A0A] border-l-2 border-[#FFB800] p-3 text-[11px] font-mono text-[#8F9CA8]">
            <strong className="text-[#FFB800] block mb-1">NOTA TÁTICA:</strong>
            O volume alvo será exibido no War Room e na grade de planejamento para cálculo de cumprimento da meta.
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#2A343D]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              CANCELAR
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              GRAVAR META
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
