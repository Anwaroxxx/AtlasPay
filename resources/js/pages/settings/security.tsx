import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Lock, 
    ShieldCheck, 
    Smartphone, 
    History, 
    Key, 
    AlertCircle,
    Fingerprint,
    Zap,
    ShieldAlert,
    ChevronRight
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import { Badge } from '@/components/ui/badge';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Sovereign Security" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-6 p-6 md:p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <ShieldCheck className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vault Defense v4.2</span>
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl uppercase leading-none">
                        Security <span className="text-primary italic">Protocols.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base font-medium max-w-xl">
                        Manage your biometric access, cryptographic keys, and multi-factor authentication layers.
                    </p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Password Management */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-elevated rounded-3xl bg-card glass-card">
                            <CardHeader className="p-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Key className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Access <span className="text-primary italic">Key.</span></CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-2">Rotate your cryptographic entry token.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Form
                                    {...SecurityController.update.form()}
                                    options={{ preserveScroll: true }}
                                    resetOnError={['password', 'password_confirmation', 'current_password']}
                                    resetOnSuccess
                                    className="space-y-8"
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="current_password">Current Vault Secret</Label>
                                                    <PasswordInput
                                                        id="current_password"
                                                        ref={currentPasswordInput}
                                                        name="current_password"
                                                        autoComplete="current-password"
                                                        className="h-16 rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/10"
                                                    />
                                                    <InputError message={errors.current_password} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="password">New Vault Secret</Label>
                                                    <PasswordInput
                                                        id="password"
                                                        ref={passwordInput}
                                                        name="password"
                                                        autoComplete="new-password"
                                                        className="h-16 rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/10"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="password_confirmation">Confirm Secret</Label>
                                                    <PasswordInput
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        autoComplete="new-password"
                                                        className="h-16 rounded-2xl bg-muted/20 border-border/50 focus:ring-primary/10"
                                                    />
                                                    <InputError message={errors.password_confirmation} />
                                                </div>
                                            </div>

                                            <Button disabled={processing} className="w-full h-18 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-elevated transition-transform active:scale-95">
                                                Commit Key Rotation
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 2FA Section */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-elevated bg-neutral-900 text-white rounded-3xl dark:bg-black relative overflow-hidden group">
                            <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
                            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
                            
                            <CardHeader className="relative z-10 p-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <Fingerprint className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Quantum <span className="text-primary italic">Auth.</span></CardTitle>
                                </div>
                                <CardDescription className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest mt-2">Biometric Multi-Factor Protocol</CardDescription>
                            </CardHeader>
                            
                            <CardContent className="relative z-10 p-6 space-y-10">
                                <div className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-md shadow-inner">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`h-3 w-3 rounded-full ${twoFactorEnabled ? 'bg-primary animate-ping' : 'bg-neutral-700'}`} />
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground">
                                            DEFENSE STATUS: {twoFactorEnabled ? 'OPTIMAL' : 'VULNERABLE'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                        Activate RSA-4096 biometric challenge. Every sensitive action will require a cryptographic signature from your linked authenticator.
                                    </p>
                                </div>

                                {twoFactorEnabled ? (
                                    <div className="space-y-6">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button variant="destructive" type="submit" disabled={processing} className="w-full h-18 rounded-2xl font-black uppercase tracking-widest shadow-lg">
                                                    Decommission Protection
                                                </Button>
                                            )}
                                        </Form>
                                        <div className="pt-6 border-t border-white/10">
                                            <TwoFactorRecoveryCodes
                                                recoveryCodesList={recoveryCodesList}
                                                fetchRecoveryCodes={fetchRecoveryCodes}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {hasSetupData ? (
                                            <Button onClick={() => setShowSetupModal(true)} className="w-full h-20 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-elevated group">
                                                <ShieldCheck className="mr-3 h-6 w-6" />
                                                Continue Secure Setup
                                            </Button>
                                        ) : (
                                            <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                                {({ processing }) => (
                                                    <Button type="submit" disabled={processing} className="w-full h-20 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-elevated transition-all hover:scale-[1.02]">
                                                        Activate Sovereign Auth
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Additional Security Insights */}
                <motion.div variants={item} className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                    <Card className="border border-border shadow-soft rounded-2xl bg-card p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                        <div className="space-y-2">
                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Node Integrity</p>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-4xl font-black tracking-tighter">01</span>
                            <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase">Active Session</Badge>
                        </div>
                    </Card>

                    <Card className="border border-border shadow-soft rounded-2xl bg-card p-6 flex flex-col justify-between group hover:border-success/30 transition-colors">
                        <div className="space-y-2">
                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-success transition-colors">
                                <History className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Log Sanitation</p>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-black tracking-tighter text-success uppercase italic">CLEAN</span>
                            <p className="text-[10px] text-muted-foreground/50 font-black">0 INCIDENTS</p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-elevated bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
                        <div className="relative z-10 space-y-2">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Defense Grade</p>
                        </div>
                        <div className="relative z-10 mt-4 flex items-end justify-between">
                            <span className="text-3xl font-black tracking-tighter uppercase leading-none">ELITE</span>
                            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">RSA-4096</p>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Defense Node',
            href: edit(),
        },
    ],
};

