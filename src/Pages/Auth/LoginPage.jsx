import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { LogIn, Mail, Lock, Cpu, Rocket, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for premium feel
        setTimeout(async () => {
            try {
                const success = await login(email, password);
                if (success) {
                    navigate('/');
                } else {
                    setError('Invalid credentials. Please try again.');
                    setIsLoading(false);
                }
            } catch (err) {
                setError('Establish Link Failed. Server Offline.');
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#0A0A0B]">
            {/* Dynamic Tech Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(202,29,42,0.05),transparent_70%)]" />
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#0A0A0B]/80 to-[#0A0A0B]" />
            </div>

            {/* Floating Premium Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse duration-[10s]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse duration-[8s]" />

            <div className="w-full max-w-xl relative z-10 group">
                {/* Decorative Tech border */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600/20 via-blue-600/20 to-red-600/20 rounded-[2.5rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative bg-[#0F0F12]/80 backdrop-blur-3xl p-10 md:p-14 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                    {/* Scanner Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-scan" />

                    <div className="flex flex-col items-center mb-12">
                        <div className="relative group/icon mb-8">

                            <div className="w-20 h-20 bg-gradient-to-br from-[#1A1A1E] to-[#0A0A0B] rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative z-10 transform group-hover/icon:rotate-[10deg] transition-transform duration-500">
                                <Cpu className="w-10 h-10 text-red-500" />
                            </div>

                        </div>

                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                                Nexus <span className="text-red-600">Terminal</span>
                            </h1>
                            <div className="h-1 w-12 bg-red-600 mx-auto rounded-full" />
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">
                                Authentication Required
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">Admin ID</label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-white/20 group-focus-within/input:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@gmail.com"
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white placeholder:text-white/20 focus:bg-white/10 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">Passcode</label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-white/20 group-focus-within/input:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white placeholder:text-white/20 focus:bg-white/10 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 outline-none transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 animate-shake">
                                <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
                                <p className="text-red-500 text-[11px] font-black uppercase tracking-wider leading-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(202,29,42,0.5)] active:scale-95 transition-all relative overflow-hidden flex items-center justify-center gap-3 group/btn"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Establish Link <LogIn className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-[.25em]">
                                Core Security: AES-256 Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
