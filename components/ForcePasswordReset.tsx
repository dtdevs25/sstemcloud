import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForcePasswordResetProps {
    email: string;
    onSuccess: () => void;
}

export const ForcePasswordReset: React.FC<ForcePasswordResetProps> = ({ email, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('As novas senhas não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/force-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                onSuccess();
            } else {
                setError(data.error || 'Erro ao redefinir senha.');
            }
        } catch (err) {
            setError('Falha na comunicação com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all isolate">
            {/* Background Overlay & Blurs */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fadeIn transition-all"></div>

            <div className="absolute top-0 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-8 sm:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-brand-500 text-white rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center mx-auto mb-6">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Primeiro Acesso</h1>
                        <p className="text-slate-400 font-medium text-sm">Por segurança, você deve redefinir a sua senha temporária para continuar.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha Atual (Temporária)</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 text-white font-bold placeholder-slate-500 transition-all outline-none"
                                    placeholder="Senha enviada por e-mail"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Nova Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 text-white font-bold placeholder-slate-500 transition-all outline-none"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <KeyComponent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 text-white font-bold placeholder-slate-500 transition-all outline-none"
                                    placeholder="Repita a nova senha"
                                />
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-brand-500/20 hover:-translate-y-1 uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Redefinir e Acessar
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-[10px] font-medium">
                        Seus dados são criptografados com segurança de nível militar.
                    </p>
                </div>
            </div>
        </div>
    );
};

const KeyComponent = ({ size, className }: { size: number, className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m21 2-2 2-2-2-2 2-2-2-2 2-2-2-2 2" />
        <path d="M15 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8Z" />
        <circle cx="7" cy="10" r="1" />
    </svg>
);
