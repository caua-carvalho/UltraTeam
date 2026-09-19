import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { ActivityForm } from '@/components/ActivityForm';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export const NewActivityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = async (formData: any) => {
    if (!user) return;
    setErrorMessage('');

    try {
      const { error } = await supabase.from('activities').insert({
        user_id: user.id,
        title: formData.title,
        distance_km: formData.distance_km,
        duration_min: formData.duration_min || null,
        activity_type: formData.activity_type,
        scheduled_date: formData.scheduled_date,
        completed: formData.completed,
        notes: formData.notes?.trim() || null,
      });

      if (error) {
        throw error;
      }

      navigate('/activities');
    } catch (err: any) {
      console.error('Error creating activity:', err);
      setErrorMessage(err.message || 'Falha ao gravar missão no banco de dados.');
    }
  };

  if (!user) {
    return <Loading fullScreen message="AUTENTICANDO OPERADOR..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#2A343D] pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#00FF66] inline-block" />
          <span className="font-mono text-xs font-bold text-[#00FF66] tracking-tactical uppercase">
            NOVA ENTRADA DE DADOS
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFFFFF] tracking-heading uppercase mt-1">
          REGISTRAR NOVA MISSÃO
        </h1>
      </div>

      {errorMessage && (
        <div className="p-3 bg-[#FF2A3D]/10 border-l-2 border-[#FF2A3D] text-[#FF2A3D] font-mono text-xs">
          [ERRO]: {errorMessage}
        </div>
      )}

      {/* Form Container */}
      <Card variant="default" cornerTicks={true} className="p-6">
        <ActivityForm
          onSubmit={handleCreate}
          onCancel={() => navigate('/activities')}
          submitLabel="SALVAR MISSÃO NO LOG"
        />
      </Card>
    </div>
  );
};
