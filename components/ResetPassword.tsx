import React, { useState } from 'react';
import { Lock, CheckCircle, Loader2, Eye, EyeOff, ArrowLeft, CloudLightning } from 'lucide-react';
import { Button } from './Button';

interface ResetPasswordProps {
    token: string;
    onSuccess: () => void;
    onBack: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token, onSuccess, onBack }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 3000);
            } else {
                setError(data.error || 'Erro ao redefinir senha. O link pode ter expirado.');
            }
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-sky-400 flex items-center justify-center p-4 relative overflow-hidden isolate transition-all">
                <div className="w-full max-w-[360px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] p-8 text-center animate-fadeIn shadow-2xl">
                    <div className="bg-green-100/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <CheckCircle className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Sucesso!</h2>
                    <p className="text-blue-50 text-sm font-medium opacity-90">
                        Sua senha foi alterada com sucesso. Redirecionando para o login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-400 flex items-center justify-center p-4 relative overflow-hidden isolate">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/30 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-[360px] relative">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-fadeIn">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 shadow-lg mb-4 border border-white/30 backdrop-blur-sm">
                            <CloudLightning className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Nova Senha</h2>
                        <p className="text-blue-50 font-semibold text-xs mt-1 opacity-80 uppercase tracking-widest">Crie uma senha segura</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-sky-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-12 py-3.5 bg-black/20 focus:bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                                placeholder="Nova Senha"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-sky-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full pl-10 pr-12 py-3.5 bg-black/20 focus:bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                                placeholder="Confirmar Nova Senha"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-[10px] bg-red-500/20 border border-red-500/50 text-white p-3 rounded-xl font-bold animate-pulse">
                                {error}
                            </div>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 rounded-xl py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black uppercase text-xs tracking-widest transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mx-auto h-5 w-5" />
                            ) : (
                                "Redefinir Senha"
                            )}
                        </Button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors mt-4"
                        >
                            <ArrowLeft size={12} /> Voltar ao Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
