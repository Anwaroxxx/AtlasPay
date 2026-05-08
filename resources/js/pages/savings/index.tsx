import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    TrendingUp,
    ShieldCheck,
    Lock,
    Unlock,
    AlertTriangle,
    Plus,
    Calendar,
    Zap,
    ArrowRight,
    Loader2,
    Building2,
    Timer,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Goal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    monthly_deduction: number;
    target_date: string;
    locked_until: string;
    status: 'active' | 'completed' | 'unlocked';
}

interface Props {
    goals: Goal[];
}

export default function Savings({ goals }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [verifyingGoalId, setVerifyingGoalId] = useState<number | null>(null);
    const [verificationCode, setVerificationCode] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        target_amount: '',
        initial_deposit: '',
        target_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/savings', {
            onSuccess: () => {
                setIsCreating(false);
                reset();
                toast.success('Savings goal successfully created.');
            },
        });
    };

    const requestUnlock = (goalId: number) => {
        router.post(
            `/savings/${goalId}/request-unlock`,
            {},
            {
                onSuccess: () => {
                    setVerifyingGoalId(goalId);
                    toast.info('Verification code dispatched to your Gmail.');
                },
            },
        );
    };

    const confirmUnlock = (e: React.FormEvent) => {
        e.preventDefault();

        if (!verifyingGoalId) {
            return;
        }

        router.post(
            `/savings/${verifyingGoalId}/unlock`,
            { code: verificationCode },
            {
                onSuccess: () => {
                    setVerifyingGoalId(null);
                    setVerificationCode('');
                },
                onError: (err: any) => {
                    if (err.code) {
                        toast.error(err.code);
                    }
                },
            },
        );
    };

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
            <Head title="Savings Goals" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 md:p-6 md:p-8"
            >
                {/* Header */}
                <motion.div
                    variants={item}
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Target className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                                Savings Management
                            </span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter uppercase md:text-6xl">
                            AutoCut{' '}
                            <span className="text-primary italic">Vault.</span>
                        </h1>
                        <p className="max-w-xl text-sm font-medium text-muted-foreground md:text-base">
                            Automated savings made simple. Set your financial
                            goals and track your progress as you build your
                            future.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="shadow-elevated group h-16 rounded-2xl bg-primary px-8 font-black tracking-widest text-primary-foreground uppercase transition-all hover:scale-105"
                    >
                        <Plus className="mr-3 h-6 w-6 transition-transform group-hover:rotate-90" />{' '}
                        Create Goal
                    </Button>
                </motion.div>

                {/* Create Goal Modal/Section */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="shadow-elevated glass-card overflow-hidden rounded-3xl border-none bg-card">
                                <CardHeader className="border-b border-border bg-muted/20 p-6">
                                    <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                        Set a New{' '}
                                        <span className="text-primary italic">
                                            Goal.
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[10px] font-black tracking-widest uppercase">
                                        Specify your target amount and date.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                Goal Name
                                            </Label>
                                            <Input
                                                placeholder="e.g., Summer Vacation"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-14 rounded-2xl border-border/50 bg-muted/20 text-base font-black"
                                            />
                                            {errors.name && (
                                                <p className="text-xs font-bold text-destructive">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                    Target Amount (MAD)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={data.target_amount}
                                                    onChange={(e) =>
                                                        setData(
                                                            'target_amount',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 text-base font-black"
                                                />
                                                {errors.target_amount && (
                                                    <p className="text-xs font-bold text-destructive">
                                                        {errors.target_amount}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                    Initial Deposit (MAD)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Optional"
                                                    value={data.initial_deposit}
                                                    onChange={(e) =>
                                                        setData(
                                                            'initial_deposit',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-primary/20 bg-primary/5 text-base font-black focus:ring-primary/20"
                                                />
                                                {errors.initial_deposit && (
                                                    <p className="text-xs font-bold text-destructive">
                                                        {errors.initial_deposit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                Target Date
                                            </Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="date"
                                                    value={data.target_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'target_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-border/50 bg-muted/20 text-base font-black"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="h-14 w-14 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-lg"
                                                >
                                                    {processing ? (
                                                        <Loader2 className="animate-spin" />
                                                    ) : (
                                                        <ChevronRight />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.target_date && (
                                                <p className="text-xs font-bold text-destructive">
                                                    {errors.target_date}
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Goals Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => {
                        const progress =
                            (goal.current_amount / goal.target_amount) * 100;
                        const isLocked = goal.status === 'active';
                        const daysLeft = Math.ceil(
                            (new Date(goal.target_date).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                        );

                        return (
                            <motion.div key={goal.id} variants={item}>
                                <Card className="shadow-elevated glass-card group h-full overflow-hidden rounded-3xl border border-none bg-card transition-all hover:border-primary/20">
                                    <CardHeader className="p-8 pb-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="shadow-soft flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <Badge
                                                className={`border-none px-3 py-1 text-[9px] font-black tracking-widest uppercase ${
                                                    goal.status === 'completed'
                                                        ? 'bg-success text-success-foreground'
                                                        : goal.status ===
                                                            'unlocked'
                                                          ? 'bg-warning text-warning-foreground'
                                                          : 'bg-primary/20 text-primary'
                                                }`}
                                            >
                                                {goal.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="truncate text-2xl font-black tracking-tight uppercase">
                                            {goal.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                                            <Timer className="h-3 w-3" />{' '}
                                            {daysLeft > 0
                                                ? `${daysLeft} Days Remaining`
                                                : 'Goal Reached'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-8 pt-4">
                                        <div className="space-y-3">
                                            <div className="flex items-end justify-between px-1">
                                                <span className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                                    Progress
                                                </span>
                                                <span className="text-lg font-black tracking-tight">
                                                    {progress.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className="h-2 border border-border/50 bg-muted/30"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                                                <p className="mb-1 text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                                    Saved
                                                </p>
                                                <p className="text-xl font-black tracking-tight">
                                                    {goal.current_amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                                                <p className="mb-1 text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                                    Goal
                                                </p>
                                                <p className="text-xl font-black tracking-tight">
                                                    {goal.target_amount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                                                        <Zap className="h-4 w-4 fill-current" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">
                                                            Monthly Saving
                                                        </p>
                                                        <p className="text-sm font-black tracking-tight">
                                                            {goal.monthly_deduction.toLocaleString()}{' '}
                                                            MAD
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex h-10 w-10 items-center justify-center text-primary/40">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                            </div>

                                            {isLocked && (
                                                <div className="flex flex-col gap-3 rounded-2xl border border-destructive/10 bg-destructive/5 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-destructive">
                                                            <AlertTriangle className="h-3.5 w-3.5" />
                                                            <span className="text-[10px] font-black tracking-widest uppercase">
                                                                Emergency Access
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-black tracking-widest text-destructive/60 uppercase">
                                                            2.0% Protocol Fee
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            requestUnlock(
                                                                goal.id,
                                                            )
                                                        }
                                                        variant="destructive"
                                                        className="h-10 w-full rounded-xl bg-destructive/10 text-[10px] font-black tracking-[0.2em] text-destructive uppercase transition-all hover:bg-destructive hover:text-destructive-foreground"
                                                    >
                                                        <Unlock className="mr-2 h-3.5 w-3.5" />{' '}
                                                        Emergency Unlock
                                                    </Button>
                                                </div>
                                            )}

                                            {!isLocked && (
                                                <div className="flex items-center justify-center gap-2 rounded-2xl border border-success/10 bg-success/5 p-4">
                                                    <Unlock className="h-4 w-4 text-success" />
                                                    <span className="text-[10px] font-black tracking-widest text-success uppercase">
                                                        Vault Unlocked
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}

                    {goals.length === 0 && !isCreating && (
                        <div className="col-span-full py-32 text-center">
                            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                                <Building2 className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-muted-foreground/50 uppercase">
                                No active savings goals found.
                            </h3>
                            <p className="mt-2 text-sm font-medium text-muted-foreground/40">
                                Create your first savings goal to start building
                                your future.
                            </p>
                        </div>
                    )}
                </div>

                {/* Verification Modal */}
                <AnimatePresence>
                    {verifyingGoalId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md"
                            >
                                <Card className="shadow-elevated glass-card overflow-hidden rounded-3xl border-2 border-destructive/20 bg-card">
                                    <CardHeader className="space-y-2 p-8 text-center">
                                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                            <ShieldCheck className="h-8 w-8" />
                                        </div>
                                        <CardTitle className="text-2xl font-black tracking-tight uppercase">
                                            Security{' '}
                                            <span className="text-destructive italic">
                                                Check.
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                                            A 4-digit authorization code was
                                            sent to your Gmail.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <form
                                            onSubmit={confirmUnlock}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <Label className="block text-center text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                    Enter Authorization Code
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0000"
                                                    value={verificationCode}
                                                    onChange={(e) =>
                                                        setVerificationCode(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-16 rounded-2xl border-destructive/20 bg-muted/20 text-center text-2xl font-black tracking-[0.5em] focus:ring-destructive/20"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setVerifyingGoalId(null)
                                                    }
                                                    className="h-14 flex-1 rounded-2xl text-[10px] font-black tracking-widest uppercase"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    className="h-14 flex-[2] rounded-2xl bg-destructive text-[10px] font-black tracking-widest uppercase shadow-lg hover:bg-destructive"
                                                >
                                                    Confirm Liquidation
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}

Savings.layout = {
    breadcrumbs: [
        {
            title: 'Savings Goals',
            href: '/savings',
        },
    ],
};
