import { Head, useForm, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    RotateCcw,
    Coins,
    Plus,
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    X,
    Zap,
    Loader2,
    UserPlus,
    Check,
    XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
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

interface DaretMember {
    id: number;
    user: { id: number; name: string };
    turn_order: number;
    status: 'pending' | 'accepted' | 'declined';
    has_paid_current_round: boolean;
    has_received_payout: boolean;
}

interface DaretGroup {
    id: number;
    name: string;
    monthly_amount: number;
    cycle_duration_months: number;
    current_round: number;
    status: 'pending' | 'active' | 'completed';
    members: DaretMember[];
    creator: { id: number; name: string };
}

interface PendingInvitation {
    id: number;
    group: DaretGroup;
}

interface Props {
    myGroups: DaretGroup[];
    allUsers: { id: number; first_name: string; last_name: string }[];
    pendingInvitations: PendingInvitation[];
}

export default function Daret({
    myGroups,
    allUsers,
    pendingInvitations,
}: Props) {
    const { props } = usePage();
    const auth = props.auth as any;
    const [isCreating, setIsCreating] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        monthly_amount: '',
        member_ids: [] as number[],
    });

    useEffect(() => {
        const echo = (window as any).Echo;

        if (!echo || !auth?.user) {
            return;
        }

        const channel = echo.private(`App.Models.User.${auth.user.id}`);

        channel.listen('.daret.invitation', (e: any) => {
            toast.info(`New Daret Invitation: ${e.group.name}`);
            router.reload({ only: ['pendingInvitations'] });
        });

        // Listen for group updates globally or specifically
        const publicChannel = echo.channel('daret-groups');
        publicChannel.listen('.group.updated', () => {
            router.reload({ only: ['myGroups'] });
        });

        return () => {
            echo.leave(`App.Models.User.${auth.user.id}`);
            echo.leave('daret-groups');
        };
    }, [auth?.user]);

    const filteredUsers = allUsers.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();

        return (
            fullName.includes(searchQuery.toLowerCase()) &&
            !selectedUsers.includes(user.id)
        );
    });

    const toggleUser = (userId: number) => {
        const newSelection = selectedUsers.includes(userId)
            ? selectedUsers.filter((id) => id !== userId)
            : [...selectedUsers, userId];
        setSelectedUsers(newSelection);
        setData('member_ids', newSelection);
    };

    const removeUser = (userId: number) => {
        const newSelection = selectedUsers.filter((id) => id !== userId);
        setSelectedUsers(newSelection);
        setData('member_ids', newSelection);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/daret', {
            onSuccess: () => {
                setIsCreating(false);
                reset();
                setSelectedUsers([]);
                setSearchQuery('');
                toast.success('Group created! Invitations sent.');
            },
        });
    };

    const handleAccept = (groupId: number) => {
        router.post(
            `/daret/${groupId}/accept`,
            {},
            {
                onSuccess: () => toast.success('You joined the group!'),
            },
        );
    };

    const handleDecline = (groupId: number) => {
        router.post(
            `/daret/${groupId}/decline`,
            {},
            {
                onSuccess: () => toast.success('Invitation declined.'),
            },
        );
    };

    const handlePayment = (groupId: number) => {
        router.post(
            `/daret/${groupId}/pay`,
            {},
            {
                onSuccess: () => toast.success('Contribution paid!'),
            },
        );
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };
    const item: any = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <>
            <Head title="Daret Groups" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 md:p-10"
            >
                {/* Header */}
                <motion.div
                    variants={item}
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                                Social Savings
                            </span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter uppercase md:text-5xl">
                            Daret{' '}
                            <span className="text-primary italic">Groups.</span>
                        </h1>
                        <p className="max-w-xl text-xs font-medium text-muted-foreground md:text-sm">
                            Traditional Moroccan savings circles, modernized for
                            the digital age.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="shadow-elevated h-12 shrink-0 rounded-2xl bg-primary px-8 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-primary/90 active:scale-95"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create New Circle
                    </Button>
                </motion.div>

                {/* Pending Invitations */}
                {pendingInvitations && pendingInvitations.length > 0 && (
                    <motion.div variants={item} className="space-y-3">
                        <h2 className="text-sm font-bold text-muted-foreground">
                            Pending Invitations
                        </h2>
                        {pendingInvitations.map((inv) => (
                            <Card
                                key={inv.id}
                                className="rounded-2xl border border-primary/20 bg-primary/5"
                            >
                                <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                                    <div>
                                        <p className="font-bold">
                                            {inv.group.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Created by {inv.group.creator.name}{' '}
                                            · {inv.group.monthly_amount}{' '}
                                            MAD/month ·{' '}
                                            {inv.group.members.length} members
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleAccept(inv.group.id)
                                            }
                                            className="h-9 rounded-lg"
                                        >
                                            <Check className="mr-1 h-4 w-4" />{' '}
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleDecline(inv.group.id)
                                            }
                                            className="h-9 rounded-lg"
                                        >
                                            <XCircle className="mr-1 h-4 w-4" />{' '}
                                            Decline
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                )}

                {/* Create Group Form */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="rounded-2xl border border-border shadow-sm">
                                <CardHeader className="border-b border-border/50 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-bold">
                                                Create a Group
                                            </CardTitle>
                                            <CardDescription className="mt-0.5 text-xs">
                                                Pick members and set the monthly
                                                amount.
                                            </CardDescription>
                                        </div>
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="rounded-lg p-2 transition-colors hover:bg-muted"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-5"
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Group Name</Label>
                                                <Input
                                                    placeholder="e.g., Family Savings"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 rounded-xl"
                                                />
                                                {errors.name && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>
                                                    Monthly Amount (MAD)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Min 100"
                                                    value={data.monthly_amount}
                                                    onChange={(e) =>
                                                        setData(
                                                            'monthly_amount',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 rounded-xl"
                                                />
                                                {errors.monthly_amount && (
                                                    <p className="text-xs text-destructive">
                                                        {errors.monthly_amount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Member Search */}
                                        <div className="space-y-3">
                                            <Label>
                                                Add Members (
                                                {selectedUsers.length} selected)
                                            </Label>
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search by name..."
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 rounded-xl pl-10"
                                                />
                                            </div>

                                            {/* Selected members chips */}
                                            {selectedUsers.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedUsers.map(
                                                        (uid) => {
                                                            const u =
                                                                allUsers.find(
                                                                    (x) =>
                                                                        x.id ===
                                                                        uid,
                                                                );

                                                            return u ? (
                                                                <Badge
                                                                    key={uid}
                                                                    className="rounded-lg border-none bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                                                                >
                                                                    {
                                                                        u.first_name
                                                                    }{' '}
                                                                    {
                                                                        u.last_name
                                                                    }
                                                                    <button
                                                                        onClick={() =>
                                                                            removeUser(
                                                                                uid,
                                                                            )
                                                                        }
                                                                        className="ml-2 hover:text-destructive"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </Badge>
                                                            ) : null;
                                                        },
                                                    )}
                                                </div>
                                            )}

                                            {/* Search results */}
                                            {searchQuery && (
                                                <div className="max-h-40 divide-y divide-border/50 overflow-y-auto rounded-xl border border-border">
                                                    {filteredUsers.length ===
                                                    0 ? (
                                                        <p className="p-3 text-center text-xs text-muted-foreground">
                                                            No users found
                                                        </p>
                                                    ) : (
                                                        filteredUsers
                                                            .slice(0, 10)
                                                            .map((user) => (
                                                                <button
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() => {
                                                                        toggleUser(
                                                                            user.id,
                                                                        );
                                                                        setSearchQuery(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="flex w-full items-center gap-3 p-3 text-left text-sm transition-colors hover:bg-muted/50"
                                                                >
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                        {user.first_name.charAt(
                                                                            0,
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium">
                                                                        {
                                                                            user.first_name
                                                                        }{' '}
                                                                        {
                                                                            user.last_name
                                                                        }
                                                                    </span>
                                                                    <UserPlus className="ml-auto h-4 w-4 text-muted-foreground" />
                                                                </button>
                                                            ))
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            disabled={
                                                processing ||
                                                selectedUsers.length === 0
                                            }
                                            className="h-12 w-full rounded-xl font-bold"
                                        >
                                            {processing ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                            )}
                                            Create Group & Send Invitations
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Groups */}
                <div className="grid gap-5 md:grid-cols-2">
                    {myGroups.map((group) => {
                        const currentMemberTurn = group.members.find(
                            (m) => m.turn_order === group.current_round,
                        );
                        const myMemberInfo = group.members.find(
                            (m) => m.user.id === auth.user.id,
                        );
                        const isMyTurn =
                            currentMemberTurn?.user.id === auth.user.id;
                        const acceptedCount = group.members.filter(
                            (m) => m.status === 'accepted',
                        ).length;
                        const totalMembers = group.members.length;
                        const allAccepted = acceptedCount === totalMembers;

                        return (
                            <motion.div key={group.id} variants={item}>
                                <Card className="flex h-full flex-col rounded-2xl border border-border shadow-sm">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="mb-2 flex items-start justify-between">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-bold"
                                            >
                                                {group.status === 'pending'
                                                    ? `Waiting (${acceptedCount}/${totalMembers} joined)`
                                                    : `Round ${group.current_round}/${group.cycle_duration_months}`}
                                            </Badge>
                                            <Badge
                                                className={`border-none text-[10px] font-bold ${group.status === 'active' ? 'bg-success/20 text-success' : group.status === 'pending' ? 'bg-warning/20 text-warning' : 'bg-muted'}`}
                                            >
                                                {group.status === 'active'
                                                    ? 'Active'
                                                    : group.status === 'pending'
                                                      ? 'Pending'
                                                      : 'Done'}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg font-bold">
                                            {group.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {group.monthly_amount} MAD / month ·{' '}
                                            {totalMembers} members
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4 p-5 pt-0">
                                        {/* Current turn (only for active groups) */}
                                        {group.status === 'active' && (
                                            <div
                                                className={`rounded-xl border p-3 ${isMyTurn ? 'border-primary/20 bg-primary/10' : 'border-border/50 bg-muted/30'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Coins
                                                        className={`h-5 w-5 ${isMyTurn ? 'text-primary' : 'text-muted-foreground'}`}
                                                    />
                                                    <div>
                                                        <p className="text-[10px] font-medium text-muted-foreground">
                                                            This month's turn
                                                        </p>
                                                        <p className="text-sm font-bold">
                                                            {isMyTurn
                                                                ? 'Your turn! 🎉'
                                                                : currentMemberTurn
                                                                      ?.user
                                                                      .name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Members list */}
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                <Users className="h-3 w-3" />{' '}
                                                Members
                                            </p>
                                            <div className="space-y-1.5">
                                                {group.members
                                                    .sort(
                                                        (a, b) =>
                                                            a.turn_order -
                                                            b.turn_order,
                                                    )
                                                    .map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/20 p-2.5"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <div
                                                                    className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${member.turn_order === group.current_round && group.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                                                >
                                                                    {
                                                                        member.turn_order
                                                                    }
                                                                </div>
                                                                <span className="text-sm font-medium">
                                                                    {
                                                                        member
                                                                            .user
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {member.status ===
                                                                'pending' ? (
                                                                    <Badge className="border-none bg-warning/20 text-[9px] text-warning">
                                                                        Invited
                                                                    </Badge>
                                                                ) : member.status ===
                                                                  'declined' ? (
                                                                    <Badge className="border-none bg-destructive/20 text-[9px] text-destructive">
                                                                        Declined
                                                                    </Badge>
                                                                ) : group.status ===
                                                                  'active' ? (
                                                                    member.has_paid_current_round ? (
                                                                        <Badge className="border-none bg-success/20 text-[9px] text-success">
                                                                            Paid
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge className="border-none bg-muted text-[9px] text-muted-foreground">
                                                                            Unpaid
                                                                        </Badge>
                                                                    )
                                                                ) : (
                                                                    <Badge className="border-none bg-success/20 text-[9px] text-success">
                                                                        Joined
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Pay button (active groups only) */}
                                    {group.status === 'active' &&
                                        myMemberInfo && (
                                            <div className="p-5 pt-0">
                                                <Button
                                                    onClick={() =>
                                                        handlePayment(group.id)
                                                    }
                                                    disabled={
                                                        myMemberInfo.has_paid_current_round
                                                    }
                                                    className="h-11 w-full rounded-xl font-bold"
                                                    variant={
                                                        myMemberInfo.has_paid_current_round
                                                            ? 'outline'
                                                            : 'default'
                                                    }
                                                >
                                                    {myMemberInfo.has_paid_current_round ? (
                                                        <span className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4" />{' '}
                                                            Already Paid
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <Zap className="h-4 w-4" />{' '}
                                                            Pay{' '}
                                                            {
                                                                group.monthly_amount
                                                            }{' '}
                                                            MAD
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                </Card>
                            </motion.div>
                        );
                    })}

                    {myGroups.length === 0 && !isCreating && (
                        <div className="col-span-full py-16 text-center">
                            <RotateCcw className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
                            <h3 className="text-lg font-bold text-muted-foreground/50">
                                No groups yet
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground/30">
                                Create your first savings group to get started.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}

Daret.layout = {
    breadcrumbs: [{ title: 'Daret Groups', href: '/daret' }],
};
