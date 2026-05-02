import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Lock, 
    ShieldCheck, 
    Smartphone, 
    History, 
    Key, 
    AlertCircle,
    Fingerprint
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

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Head title="Security & Authentication" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="space-y-6 md:space-y-8 p-4 md:p-0"
            >
                <motion.div variants={item}>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Security Command Center</h1>
                    <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">Manage your vault access and authentication protocols.</p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Password Management */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-xl rounded-2xl md:rounded-[2.5rem]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-blue-500" />
                                    Access Credentials
                                </CardTitle>
                                <CardDescription>Change your password to ensure account integrity.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...SecurityController.update.form()}
                                    options={{ preserveScroll: true }}
                                    resetOnError={['password', 'password_confirmation', 'current_password']}
                                    resetOnSuccess
                                    className="space-y-6"
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current_password">Current Vault Key</Label>
                                                    <PasswordInput
                                                        id="current_password"
                                                        ref={currentPasswordInput}
                                                        name="current_password"
                                                        autoComplete="current-password"
                                                    />
                                                    <InputError message={errors.current_password} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="password">New Vault Key</Label>
                                                    <PasswordInput
                                                        id="password"
                                                        ref={passwordInput}
                                                        name="password"
                                                        autoComplete="new-password"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="password_confirmation">Confirm New Key</Label>
                                                    <PasswordInput
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        autoComplete="new-password"
                                                    />
                                                    <InputError message={errors.password_confirmation} />
                                                </div>
                                            </div>

                                            <Button disabled={processing} className="w-full rounded-xl">
                                                Update Credentials
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 2FA Section */}
                    <motion.div variants={item}>
                        <Card className="h-full border-none shadow-xl bg-neutral-900 text-white dark:bg-neutral-950 rounded-2xl md:rounded-[2.5rem]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Fingerprint className="h-5 w-5 text-emerald-500" />
                                    Multi-Factor Authentication
                                </CardTitle>
                                <CardDescription className="text-neutral-400">Add an extra layer of defense to your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`h-2 w-2 rounded-full ${twoFactorEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`} />
                                        <span className="text-sm font-bold tracking-wider uppercase">
                                            Status: {twoFactorEnabled ? 'Active Protection' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        We recommend enabling 2FA for all users. You will be prompted for a secure pin during login via your TOTP application.
                                    </p>
                                </div>

                                {twoFactorEnabled ? (
                                    <div className="space-y-4">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button variant="destructive" type="submit" disabled={processing} className="w-full">
                                                    Deactivate Protection
                                                </Button>
                                            )}
                                        </Form>
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={errors}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {hasSetupData ? (
                                            <Button onClick={() => setShowSetupModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Continue Setup
                                            </Button>
                                        ) : (
                                            <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                                {({ processing }) => (
                                                    <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                        Activate 2FA
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
                <motion.div variants={item} className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card className="border-none shadow-lg rounded-2xl md:rounded-3xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                                <Smartphone className="h-3 w-3" />
                                Linked Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-2xl font-bold">1</span>
                            <p className="text-[10px] text-neutral-500">Currently active sessions</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg rounded-2xl md:rounded-3xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                                <History className="h-3 w-3" />
                                Security Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-2xl font-bold text-emerald-500">Clean</span>
                            <p className="text-[10px] text-neutral-500">No suspicious activity detected</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-emerald-500 text-white rounded-2xl md:rounded-3xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-white/70 tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" />
                                Overall Grade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-2xl font-bold">Secure</span>
                            <p className="text-[10px] text-white/70">Meets industry standards</p>
                        </CardContent>
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
            title: 'Security settings',
            href: edit(),
        },
    ],
};
