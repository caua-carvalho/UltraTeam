import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMessage('Informe seu nome de guerra ou identificação.');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, name);
        if (error) {
          setErrorMessage(error.message || 'Falha ao cadastrar operador.');
        } else {
          setSuccessMessage(
            'Registro efetuado! Se a confirmação por e-mail estiver ativa, cheque sua caixa postal.'
          );
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha militar.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-14 h-14 bg-[#14171A] border-2 border-[#00FF66] shadow-reticle mx-auto flex items-center justify-center mb-3">
          <span className="font-mono text-2xl font-black text-[#00FF66]">UT</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FFFFFF] tracking-heading uppercase">
          ULTRATEAM <span className="text-[#00FF66]">TRACKER</span>
        </h1>
        <p className="font-mono text-xs text-[#8F9CA8] uppercase tracking-tactical">
          CONTROLE OPERACIONAL DE TREINAMENTO // 90KM ULTRA
        </p>
      </div>

      {/* Main Authentication Card */}
      <Card
        variant="default"
        cornerTicks={true}
        className="w-full max-w-md bg-[#14171A] border-[#2A343D] p-6 sm:p-8"
      >
        <div className="border-b border-[#2A343D] pb-3 mb-6 flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-[#FFFFFF] uppercase tracking-wider">
            {isSignUp ? 'NOVO OPERADOR' : 'ACESSO AO SISTEMA'}
          </h2>
          <span className="font-mono text-[10px] text-[#00FF66] uppercase bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66]/30">
            {isSignUp ? 'CADASTRO' : 'AUTENTICAÇÃO'}
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FF2A3D]/10 border-l-2 border-[#FF2A3D] text-[#FF2A3D] font-mono text-xs flex items-center space-x-2">
            <span>[!]</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#00FF66]/10 border-l-2 border-[#00FF66] text-[#00FF66] font-mono text-xs flex items-center space-x-2">
            <span>[✓]</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              label="NOME DO OPERADOR / ATLETA"
              type="text"
              placeholder="Ex: Carlos Silva (Ultra Runner)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignUp}
            />
          )}

          <Input
            label="E-MAIL DE CADASTRO"
            type="email"
            placeholder="operador@ultrateam.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="SENHA DE ACESSO"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {isSignUp ? 'REGISTRAR OPERADOR' : 'ENTRAR NO WAR ROOM'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-[#2A343D] text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="font-mono text-xs text-[#8F9CA8] hover:text-[#00FF66] tracking-tactical uppercase transition-colors"
          >
            {isSignUp
              ? '← JÁ POSSUI CREDENCIAIS? ENTRAR'
              : '+ NÃO TEM CONTA? SOLICITAR INGRESSO'}
          </button>
        </div>
      </Card>

      {/* Footer Tactical Marker */}
      <div className="mt-8 text-center font-mono text-[10px] text-[#505D68] uppercase tracking-widest">
        PROTOCOLO DE SEGURANÇA SUPABASE RLS // ENCRIPTADO 256-BIT
      </div>
    </div>
  );
};
