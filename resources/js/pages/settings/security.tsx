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
    ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

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
            transition: { staggerChildren: 0.1 },
        },
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <>
            <Head title="Sovereign Security" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 md:p-6 md:p-8"
            >
                {/* Header */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <ShieldCheck className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                            Vault Defense v4.2
                        </span>
                    </div>
                    <h1 className="font-display text-4xl leading-none font-black tracking-tighter uppercase md:text-6xl">
                        Security{' '}
                        <span className="text-primary italic">Protocols.</span>
                    </h1>
                    <p className="max-w-xl text-sm font-medium text-muted-foreground md:text-base">
                        Manage your biometric access, cryptographic keys, and
                        multi-factor authentication layers.
                    </p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Password Management */}
                    <motion.div variants={item}>
                        <Card className="shadow-elevated glass-card h-full rounded-3xl border-none bg-card">
                            <CardHeader className="p-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Key className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                        Access{' '}
                                        <span className="text-primary italic">
                                            Key.
                                        </span>
                                    </CardTitle>
                                </div>
                                <CardDescription className="mt-2 text-[10px] font-black tracking-widest uppercase">
                                    Rotate your cryptographic entry token.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Form
                                    {...SecurityController.update.form()}
                                    options={{ preserveScroll: true }}
                                    resetOnError={[
                                        'password',
                                        'password_confirmation',
                                        'current_password',
                                    ]}
                                    resetOnSuccess
                                    className="space-y-8"
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label
                                                        className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                                                        htmlFor="current_password"
                                                    >
                                                        Current Vault Secret
                                                    </Label>
                                                    <PasswordInput
                                                        id="current_password"
                                                        ref={
                                                            currentPasswordInput
                                                        }
                                                        name="current_password"
                                                        autoComplete="current-password"
                                                        className="h-16 rounded-2xl border-border/50 bg-muted/20 focus:ring-primary/10"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.current_password
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                                                        htmlFor="password"
                                                    >
                                                        New Vault Secret
                                                    </Label>
                                                    <PasswordInput
                                                        id="password"
                                                        ref={passwordInput}
                                                        name="password"
                                                        autoComplete="new-password"
                                                        className="h-16 rounded-2xl border-border/50 bg-muted/20 focus:ring-primary/10"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                                                        htmlFor="password_confirmation"
                                                    >
                                                        Confirm Secret
                                                    </Label>
                                                    <PasswordInput
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        autoComplete="new-password"
                                                        className="h-16 rounded-2xl border-border/50 bg-muted/20 focus:ring-primary/10"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password_confirmation
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                disabled={processing}
                                                className="shadow-elevated h-18 w-full rounded-2xl bg-primary font-black tracking-widest text-primary-foreground uppercase transition-transform active:scale-95"
                                            >
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
                        <Card className="shadow-elevated group relative h-full overflow-hidden rounded-3xl border-none bg-neutral-900 text-white dark:bg-black">
                            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />
                            <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />

                            <CardHeader className="relative z-10 p-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                        <Fingerprint className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                        Quantum{' '}
                                        <span className="text-primary italic">
                                            Auth.
                                        </span>
                                    </CardTitle>
                                </div>
                                <CardDescription className="mt-2 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                    Biometric Multi-Factor Protocol
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative z-10 space-y-10 p-6">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-inner backdrop-blur-md">
                                    <div className="mb-6 flex items-center gap-4">
                                        <div
                                            className={`h-3 w-3 rounded-full ${twoFactorEnabled ? 'animate-ping bg-primary' : 'bg-neutral-700'}`}
                                        />
                                        <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                                            DEFENSE STATUS:{' '}
                                            {twoFactorEnabled
                                                ? 'OPTIMAL'
                                                : 'VULNERABLE'}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed font-medium text-muted-foreground/80">
                                        Activate RSA-4096 biometric challenge.
                                        Every sensitive action will require a
                                        cryptographic signature from your linked
                                        authenticator.
                                    </p>
                                </div>

                                {twoFactorEnabled ? (
                                    <div className="space-y-6">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button
                                                    variant="destructive"
                                                    type="submit"
                                                    disabled={processing}
                                                    className="h-18 w-full rounded-2xl font-black tracking-widest uppercase shadow-lg"
                                                >
                                                    Decommission Protection
                                                </Button>
                                            )}
                                        </Form>
                                        <div className="border-t border-white/10 pt-6">
                                            <TwoFactorRecoveryCodes
                                                recoveryCodesList={
                                                    recoveryCodesList
                                                }
                                                fetchRecoveryCodes={
                                                    fetchRecoveryCodes
                                                }
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {hasSetupData ? (
                                            <Button
                                                onClick={() =>
                                                    setShowSetupModal(true)
                                                }
                                                className="shadow-elevated group h-20 w-full rounded-2xl bg-primary font-black tracking-[0.2em] text-primary-foreground uppercase"
                                            >
                                                <ShieldCheck className="mr-3 h-6 w-6" />
                                                Continue Secure Setup
                                            </Button>
                                        ) : (
                                            <Form
                                                {...enable.form()}
                                                onSuccess={() =>
                                                    setShowSetupModal(true)
                                                }
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="shadow-elevated h-20 w-full rounded-2xl bg-primary font-black tracking-[0.2em] text-primary-foreground uppercase transition-all hover:scale-[1.02]"
                                                    >
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
                <motion.div
                    variants={item}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-3"
                >
                    <Card className="shadow-soft group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                        <div className="space-y-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors group-hover:text-primary">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                Node Integrity
                            </p>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-4xl font-black tracking-tighter">
                                01
                            </span>
                            <Badge
                                variant="outline"
                                className="border-primary/20 text-[8px] font-black text-primary uppercase"
                            >
                                Active Session
                            </Badge>
                        </div>
                    </Card>

                    <Card className="shadow-soft group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-success/30">
                        <div className="space-y-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors group-hover:text-success">
                                <History className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                Log Sanitation
                            </p>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <span className="text-3xl font-black tracking-tighter text-success uppercase italic">
                                CLEAN
                            </span>
                            <p className="text-[10px] font-black text-muted-foreground/50">
                                0 INCIDENTS
                            </p>
                        </div>
                    </Card>

                    <Card className="shadow-elevated group relative flex flex-col justify-between overflow-hidden rounded-2xl border-none bg-primary p-6 text-primary-foreground">
                        <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />
                        <div className="relative z-10 space-y-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                                Defense Grade
                            </p>
                        </div>
                        <div className="relative z-10 mt-4 flex items-end justify-between">
                            <span className="text-3xl leading-none font-black tracking-tighter uppercase">
                                ELITE
                            </span>
                            <p className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                                RSA-4096
                            </p>
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
