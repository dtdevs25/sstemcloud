import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { Button } from './Button';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Ocorreu um erro. Tente novamente.');
            }
        } catch (error) {
            console.error('Error requesting password reset:', error);
            setStatus('error');
            setErrorMessage('Erro de conexão. Verifique sua internet.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative">

                {/* Header Decoração */}
                <div className="bg-blue-600 h-2 w-full"></div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recuperar Senha</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-6 animate-fadeIn">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">E-mail Enviado!</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Se o e-mail <strong>{email}</strong> estiver cadastrado em nosso sistema, você receberá um link para criar uma nova senha em instantes.
                            </p>
                            <Button onClick={onClose} fullWidth className="rounded-xl">
                                Fechar Janela
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Digite seu e-mail abaixo e enviaremos as instruções para você redefinir sua senha com segurança.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                        <Mail className={`h-5 w-5 ${status === 'error' ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border ${status === 'error' ? 'border-red-300' : 'border-slate-200 group-focus-within:border-blue-400'} rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 ${status === 'error' ? 'focus:ring-red-100' : 'focus:ring-blue-100'} transition-all`}
                                        placeholder="exemplo@email.com"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                                        <AlertCircle size={18} className="shrink-0" />
                                        <span className="text-xs font-bold">{errorMessage}</span>
                                    </div>
                                )}

                                <Button
                                    fullWidth
                                    type="submit"
                                    disabled={isLoading}
                                    className="rounded-xl py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5" /> Processando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Enviar Instruções
                                        </>
                                    )}
                                </Button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors py-2"
                                >
                                    Cancelar e voltar
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
        </div>
    );
};
