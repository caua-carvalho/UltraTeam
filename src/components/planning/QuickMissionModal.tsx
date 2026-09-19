import React, { useState } from 'react';
import { Activity, ActivityType, TrainingWeek } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate, formatFullDate, isDateInWeek } from '@/lib/utils';

interface QuickMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWeek: TrainingWeek;
  initialDate?: string;
  activityToEdit?: Activity | null;
  onSave: (activityData: {
    title: string;
    distance_km: number;
    duration_min: number | null;
    activity_type: ActivityType;
    scheduled_date: string;
    completed: boolean;
    notes: string | null;
    week_id?: string;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const QuickMissionModal: React.FC<QuickMissionModalProps> = ({
  isOpen,
  onClose,
  targetWeek,
  initialDate,
  activityToEdit,
  onSave,
  onDelete,
}) => {
  const defaultDate = activityToEdit?.scheduled_date || initialDate || targetWeek.week_start;

  const [formData, setFormData] = useState({
    title: activityToEdit?.title || '',
    distance_km: activityToEdit?.distance_km !== undefined ? activityToEdit.distance_km : '',
    duration_min: activityToEdit?.duration_min ?? '',
    activity_type: activityToEdit?.activity_type || ('longo' as ActivityType),
    scheduled_date: defaultDate,
    completed: activityToEdit?.completed ?? false,
    notes: activityToEdit?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const activityTypes: { value: ActivityType; label: string; desc: string }[] = [
    { value: 'longo', label: 'LONGO', desc: 'Volume & Resistência' },
    { value: 'tiro', label: 'TIRO', desc: 'Intervalado & Velocidade' },
    { value: 'leve', label: 'LEVE', desc: 'Regenerativo' },
    { value: 'curto', label: 'CURTO', desc: 'Manutenção' },
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.title.trim()) {
      errs.title = 'Título da missão é obrigatório';
    }

    if (!formData.distance_km || Number(formData.distance_km) <= 0) {
      errs.distance_km = 'Distância deve ser superior a 0 km';
    }

    if (!formData.scheduled_date) {
      errs.scheduled_date = 'Data é obrigatória';
    } else if (!isDateInWeek(formData.scheduled_date, targetWeek.week_start, targetWeek.week_end)) {
      errs.scheduled_date = `A data deve estar estritamente entre ${formatDate(targetWeek.week_start)} e ${formatDate(targetWeek.week_end)} (semana selecionada).`;
    }

    if (formData.duration_min && Number(formData.duration_min) < 0) {
      errs.duration_min = 'Duração não pode ser negativa';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: formData.title.trim(),
        distance_km: Number(formData.distance_km),
        duration_min: formData.duration_min !== '' ? Number(formData.duration_min) : null,
        activity_type: formData.activity_type,
        scheduled_date: formData.scheduled_date,
        completed: formData.completed,
        notes: formData.notes.trim() || null,
        week_id: targetWeek.id.startsWith('temp-') ? undefined : targetWeek.id,
      });
      onClose();
    } catch (err) {
      console.error('Error in QuickMissionModal submit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(activityToEdit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060709]/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#14171A] border border-[#00FF66] shadow-reticle p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Tactical Corner Crosshairs */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FF66]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00FF66]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00FF66]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FF66]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2A343D] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse" />
              <span className="font-mono text-[10px] text-[#00FF66] uppercase tracking-tactical">
                {isEdit ? 'EDITAR MISSÃO OPERACIONAL' : 'NOVA MISSÃO // PROGRAMAÇÃO DIÁRIA'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FFFFFF] tracking-heading uppercase mt-0.5">
              {activityToEdit ? activityToEdit.title : `MISSÃO EM ${formatFullDate(formData.scheduled_date)}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-sm text-[#8F9CA8] hover:text-[#FFFFFF] p-1.5"
          >
            ✕
          </button>
        </div>

        {/* Week Boundary Telemetry Banner */}
        <div className="bg-[#0A0A0A] border border-[#2A343D] p-3 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#8F9CA8] uppercase block">SEMANA ATIVA</span>
            <span className="text-[#FFFFFF] font-bold">
              {formatDate(targetWeek.week_start)} — {formatDate(targetWeek.week_end)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#8F9CA8] uppercase block">LIMITES PERMITIDOS</span>
            <span className="text-[#00FF66]">
              {targetWeek.week_start} a {targetWeek.week_end}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="TÍTULO DA MISSÃO"
            placeholder="Ex: Treino de Ritmo 15k ou Tiro 10x400m"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          {/* Activity Type Badges */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-bold tracking-tactical uppercase text-[#8F9CA8]">
              TIPO DE TREINO
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activityTypes.map((t) => {
                const isSelected = formData.activity_type === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setFormData({ ...formData, activity_type: t.value })}
                    className={`p-2.5 text-left border transition-all ${
                      isSelected
                        ? 'bg-[#1A1F24] border-[#00FF66] text-[#FFFFFF]'
                        : 'bg-[#0A0A0A] border-[#2A343D] text-[#8F9CA8] hover:border-[#8F9CA8]'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold uppercase">{t.label}</div>
                    <div className="font-mono text-[9px] text-[#8F9CA8] truncate">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="DISTÂNCIA (KM)"
              type="number"
              step="0.1"
              placeholder="Ex: 21.1"
              value={formData.distance_km}
              onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
              error={errors.distance_km}
              rightElement={<span className="text-[#00FF66] font-bold">KM</span>}
              required
            />

            <Input
              label="DURAÇÃO (MIN)"
              type="number"
              placeholder="Ex: 110"
              value={formData.duration_min}
              onChange={(e) => setFormData({ ...formData, duration_min: e.target.value })}
              error={errors.duration_min}
              rightElement={<span className="text-[#8F9CA8]">MIN</span>}
              helperText="Opcional"
            />

            <Input
              label="DATA DO TREINO"
              type="date"
              min={targetWeek.week_start}
              max={targetWeek.week_end}
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              error={errors.scheduled_date}
              required
            />
          </div>

          {/* Status Checkbox */}
          <div className="bg-[#0A0A0A] border border-[#2A343D] p-3 flex items-center justify-between">
            <span className="font-mono text-xs text-[#FFFFFF]">MISSÃO CONCLUÍDA?</span>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                className="w-4 h-4 accent-[#00FF66]"
              />
              <span className="font-mono text-xs font-bold text-[#00FF66] uppercase">
                {formData.completed ? 'SIM (CONCLUÍDO)' : 'NÃO (PENDENTE)'}
              </span>
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block font-mono text-[11px] font-bold uppercase text-[#8F9CA8]">
              DEBRIEFING / OBSERVAÇÕES
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações táticas, terreno, ritmo pretendido..."
              className="w-full bg-[#0A0A0A] border border-[#2A343D] focus:border-[#00FF66] text-[#FFFFFF] p-2.5 font-mono text-xs outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#2A343D]">
            <div>
              {isEdit && onDelete && activityToEdit && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    const confirmDel = window.confirm('Deseja excluir esta missão?');
                    if (confirmDel) {
                      await onDelete(activityToEdit.id);
                      onClose();
                    }
                  }}
                >
                  EXCLUIR
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                CANCELAR
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                {isEdit ? 'ATUALIZAR MISSÃO' : 'CRIAR MISSÃO'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
