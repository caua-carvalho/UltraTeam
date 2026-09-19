import React, { useState } from 'react';
import { Activity, ActivityType } from '@/lib/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ActivityFormData {
  title: string;
  distance_km: number | string;
  duration_min: number | string;
  activity_type: ActivityType;
  scheduled_date: string;
  completed: boolean;
  notes: string;
}

interface ActivityFormProps {
  initialData?: Partial<Activity>;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isEdit?: boolean;
  onDelete?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'SALVAR MISSÃO',
  isEdit = false,
  onDelete,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    title: initialData?.title || '',
    distance_km: initialData?.distance_km !== undefined ? initialData.distance_km : '',
    duration_min:
      initialData?.duration_min !== null && initialData?.duration_min !== undefined
        ? initialData.duration_min
        : '',
    activity_type: initialData?.activity_type || 'longo',
    scheduled_date: initialData?.scheduled_date || new Date().toISOString().split('T')[0],
    completed: initialData?.completed ?? false,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityTypes: { value: ActivityType; label: string; desc: string }[] = [
    { value: 'longo', label: 'LONGO', desc: 'Resistência & Volume (Zona 2)' },
    { value: 'tiro', label: 'TIRO', desc: 'Intervalado & Velocidade (VO2Max)' },
    { value: 'leve', label: 'LEVE', desc: 'Regenerativo & Soltura' },
    { value: 'curto', label: 'CURTO', desc: 'Ritmo & Manutenção' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título da missão é obrigatório';
    }

    if (!formData.distance_km || Number(formData.distance_km) <= 0) {
      newErrors.distance_km = 'Distância deve ser maior que 0 km';
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Data programada é obrigatória';
    }

    if (formData.duration_min && Number(formData.duration_min) < 0) {
      newErrors.duration_min = 'Duração não pode ser negativa';
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
        ...formData,
        distance_km: Number(formData.distance_km),
        duration_min: formData.duration_min !== '' ? Number(formData.duration_min) : 0,
      });
    } catch (err) {
      console.error('Error submitting activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="TÍTULO DA MISSÃO"
        placeholder="Ex: Longão Trilha da Serra - 35km"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        required
      />

      {/* Activity Type Selection */}
      <div className="space-y-2">
        <label className="block font-mono text-[11px] font-bold tracking-tactical uppercase text-[#8F9CA8]">
          TIPO DE TREINO // CLASSIFICAÇÃO
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {activityTypes.map((type) => {
            const isSelected = formData.activity_type === type.value;
            return (
              <button
                type="button"
                key={type.value}
                onClick={() => setFormData({ ...formData, activity_type: type.value })}
                className={`p-3 text-left border transition-all ${
                  isSelected
                    ? 'bg-[#1A1F24] border-[#00FF66] shadow-reticle text-[#FFFFFF]'
                    : 'bg-[#14171A] border-[#2A343D] text-[#8F9CA8] hover:border-[#8F9CA8]'
                }`}
              >
                <div className="font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>{type.label}</span>
                  {isSelected && <span className="text-[#00FF66] text-xs">●</span>}
                </div>
                <div className="font-mono text-[10px] text-[#8F9CA8] mt-1 leading-tight">
                  {type.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row: Distance, Duration, Scheduled Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="DISTÂNCIA ALVO (KM)"
          type="number"
          step="0.1"
          placeholder="Ex: 35.5"
          value={formData.distance_km}
          onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
          error={errors.distance_km}
          rightElement={<span className="text-[#00FF66] font-bold">KM</span>}
          required
        />

        <Input
          label="DURAÇÃO ESTIMADA/REAL (MIN)"
          type="number"
          placeholder="Ex: 180"
          value={formData.duration_min}
          onChange={(e) => setFormData({ ...formData, duration_min: e.target.value })}
          error={errors.duration_min}
          rightElement={<span className="text-[#8F9CA8]">MIN</span>}
          helperText="Opcional"
        />

        <Input
          label="DATA DA MISSÃO"
          type="date"
          value={formData.scheduled_date}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          error={errors.scheduled_date}
          required
        />
      </div>

      {/* Completed Status Checkbox */}
      <div className="bg-[#14171A] border border-[#2A343D] p-3 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold uppercase text-[#FFFFFF] tracking-wider block">
            STATUS DE EXECUÇÃO
          </span>
          <span className="font-mono text-[10px] text-[#8F9CA8]">
            Marque se o treino já foi realizado
          </span>
        </div>
        <label className="relative flex items-center cursor-pointer space-x-2">
          <input
            type="checkbox"
            checked={formData.completed}
            onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
            className="w-5 h-5 accent-[#00FF66] cursor-pointer rounded-none"
          />
          <span className="font-mono text-xs font-bold uppercase text-[#00FF66]">
            {formData.completed ? 'CONCLUÍDO' : 'PENDENTE'}
          </span>
        </label>
      </div>

      {/* Notes / Debrief */}
      <div className="space-y-1.5 text-left">
        <label className="block font-mono text-[11px] font-bold tracking-tactical uppercase text-[#8F9CA8]">
          NOTAS & DEBRIEFING PÓS-TREINO
        </label>
        <textarea
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Condições climáticas, altimetria, nutrição, hidratação ou percepção de esforço (PSE)..."
          className="w-full bg-[#0A0A0A] border border-[#2A343D] focus:border-[#00FF66] text-[#FFFFFF] placeholder-[#505D68] p-3 font-mono text-sm tracking-wide rounded-none focus:outline-none transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2A343D]">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              CANCELAR
            </Button>
          )}

          {isEdit && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="w-full sm:w-auto"
            >
              EXCLUIR MISSÃO
            </Button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full sm:w-auto px-8"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
