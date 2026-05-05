import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In" />

            <div className="relative">
                {/* Visual Glow following focus */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            layoutId="glow"
                            className="absolute -inset-4 bg-primary/5 blur-2xl rounded-3xl -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </AnimatePresence>

                <form onSubmit={submit} className="flex flex-col gap-8">
                    <div className="grid gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid gap-2.5"
                        >
                            <div className="flex items-center gap-2 px-1">
                                <UserIcon className={`w-3 h-3 transition-colors ${isFocused === 'email' ? 'text-primary' : 'text-white/20'}`} />
                                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.25em] font-black text-white/40">Email Address</Label>
                            </div>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setIsFocused('email')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="name@atlaspay.ma"
                                    className="h-14 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-2xl transition-all pl-4 group-hover:bg-white/[0.04]"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/10 pointer-events-none transition-all" />
                            </div>
                            <InputError message={errors.email} />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid gap-2.5"
                        >
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <Lock className={`w-3 h-3 transition-colors ${isFocused === 'password' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.25em] font-black text-white/40">Password</Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink
                                        href="/password/reset"
                                        className="text-[9px] uppercase tracking-widest font-black text-primary/60 hover:text-white transition-colors no-underline"
                                        tabIndex={5}
                                    >
                                        Forgot?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative group">
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setIsFocused('password')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-14 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-2xl transition-all group-hover:bg-white/[0.04]"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/10 pointer-events-none transition-all" />
                            </div>
                            <InputError message={errors.password} />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center justify-between px-1"
                        >
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        tabIndex={3}
                                        className="h-5 w-5 border-white/10 data-[state=checked]:bg-primary data-[state=checked]:text-white rounded-lg transition-all"
                                    />
                                </div>
                                <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider group-hover:text-white/60 transition-colors">Remember Me</span>
                            </label>
                            
                            <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/5 border border-primary/10">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Secure Login</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Button
                                type="submit"
                                className="relative w-full h-16 overflow-hidden bg-primary text-white hover:bg-success font-black uppercase tracking-[0.25em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-elevated rounded-2xl group border-none"
                                tabIndex={4}
                                disabled={processing}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                <div className="relative flex items-center justify-center gap-3">
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 fill-current group-hover:text-glow transition-all" />
                                            <span>Sign In to AtlasPay</span>
                                        </>
                                    )}
                                </div>
                            </Button>
                        </motion.div>
                    </div>

                    {canRegister && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-center"
                        >
                            <Link 
                                href="/register" 
                                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-all no-underline"
                            >
                                New here? <span className="text-primary group-hover:underline">Create an Account</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    )}
                </form>
            </div>

            <AnimatePresence>
                {status && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center gap-3"
                    >
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{status}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .text-glow {
                    filter: drop-shadow(0 0 8px currentColor);
                }
            `}</style>
        </>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

Login.layout = {
    title: 'Sign In',
    description: 'Login to manage your finances',
};

