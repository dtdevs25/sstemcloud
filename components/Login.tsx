import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, CheckCircle, Eye, EyeOff, CloudLightning, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleVerPlanos = () => {
    onBack();
    setTimeout(() => {
      const pricingElement = document.getElementById('pricing');
      if (pricingElement) {
        pricingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !email) return;

    setIsLoading(true);
    // Simula um delay de rede para UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-sky-400 flex items-center justify-center p-4 relative overflow-hidden isolate">

      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[100px] animate-pulse -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/30 rounded-full blur-[100px] animate-float -z-10 mix-blend-multiply"></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-[80px] -z-10"></div>

      {/* Botão Voltar Flutuante */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-white hover:text-white/80 transition-all flex items-center gap-2 text-sm font-bold group z-50 drop-shadow-md"
      >
        <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 backdrop-blur-md transition-all border border-white/20">
          <ArrowLeft size={20} />
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 shadow-sm">Voltar ao site</span>
      </button>

      {/* Modern Glass Card */}
      <div className="w-full max-w-[360px] relative">

        {/* Card Body */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative p-8 animate-fadeIn">

          {/* Header Minimalista */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="SST em Cloud Logo" className="h-20 w-auto object-contain drop-shadow-px" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Bem-vindo</h2>
            <p className="text-blue-50 font-semibold text-sm mt-1 drop-shadow-sm opacity-90">Acesse sua área exclusiva</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Input Moderno 1 */}
            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-sky-500 drop-shadow-sm" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-black/20 hover:bg-black/30 focus:bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder-white/70 font-medium focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 shadow-inner"
                  placeholder="Seu e-mail"
                  required
                />
              </div>
            </div>

            {/* Input Moderno 2 */}
            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-sky-500 drop-shadow-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-black/20 hover:bg-black/30 focus:bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder-white/70 font-medium focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 shadow-inner"
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 drop-shadow-sm" /> : <Eye className="h-5 w-5 drop-shadow-sm" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-white hover:text-blue-100 transition-colors drop-shadow-sm underline decoration-white/30 hover:decoration-white focus:outline-none"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {/* Botão com Gradiente Azul/Indigo para destaque */}
            <Button
              fullWidth
              type="submit"
              disabled={isLoading}
              className="mt-4 rounded-xl py-4 text-sm font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Entrando...
                </span>
              ) : (
                "Entrar Agora"
              )}
            </Button>

          </form>

          {/* Footer Card */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              onClick={handleVerPlanos}
              className="text-xs font-bold text-white/80 hover:text-white transition-all underline decoration-white/20 hover:decoration-white underline-offset-4 uppercase tracking-widest px-4 py-2"
            >
              Não tem acesso? Quero acessar
            </button>
          </div>

        </div>

        {/* Security Badge Outside */}
        <div className="text-center mt-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] font-bold text-white/80 flex items-center justify-center gap-1.5 uppercase tracking-wider drop-shadow-md">
            <CheckCircle size={12} className="text-emerald-300" /> Ambiente 100% Seguro
          </p>
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};