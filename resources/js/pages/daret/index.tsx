import { Head, useForm, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, RotateCcw, Coins, Plus, CheckCircle2, Clock, ArrowRight,
    Search, X, Zap, Loader2, UserPlus, Check, XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

export default function Daret({ myGroups, allUsers, pendingInvitations }: Props) {
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
        if (!echo || !auth?.user) return;

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

    const filteredUsers = allUsers.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) && !selectedUsers.includes(user.id);
    });

    const toggleUser = (userId: number) => {
        const newSelection = selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId];
        setSelectedUsers(newSelection);
        setData('member_ids', newSelection);
    };

    const removeUser = (userId: number) => {
        const newSelection = selectedUsers.filter(id => id !== userId);
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
            }
        });
    };

    const handleAccept = (groupId: number) => {
        router.post(`/daret/${groupId}/accept`, {}, {
            onSuccess: () => toast.success('You joined the group!')
        });
    };

    const handleDecline = (groupId: number) => {
        router.post(`/daret/${groupId}/decline`, {}, {
            onSuccess: () => toast.success('Invitation declined.')
        });
    };

    const handlePayment = (groupId: number) => {
        router.post(`/daret/${groupId}/pay`, {}, {
            onSuccess: () => toast.success('Contribution paid!')
        });
    };

    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const item: any = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    return (
        <>
            <Head title="Daret Groups" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-6xl mx-auto w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Social Savings</span>
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter md:text-5xl uppercase">
                            Daret <span className="text-primary italic">Groups.</span>
                        </h1>
                        <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-xl">Traditional Moroccan savings circles, modernized for the digital age.</p>
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="h-12 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] shadow-elevated bg-primary text-white hover:bg-primary/90 transition-all active:scale-95 shrink-0">
                        <Plus className="mr-2 h-4 w-4" /> Create New Circle
                    </Button>
                </motion.div>

                {/* Pending Invitations */}
                {pendingInvitations && pendingInvitations.length > 0 && (
                    <motion.div variants={item} className="space-y-3">
                        <h2 className="text-sm font-bold text-muted-foreground">Pending Invitations</h2>
                        {pendingInvitations.map((inv) => (
                            <Card key={inv.id} className="border border-primary/20 bg-primary/5 rounded-2xl">
                                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold">{inv.group.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Created by {inv.group.creator.name} · {inv.group.monthly_amount} MAD/month · {inv.group.members.length} members
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleAccept(inv.group.id)} className="h-9 rounded-lg">
                                            <Check className="h-4 w-4 mr-1" /> Accept
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDecline(inv.group.id)} className="h-9 rounded-lg">
                                            <XCircle className="h-4 w-4 mr-1" /> Decline
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
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <Card className="border border-border rounded-2xl shadow-sm">
                                <CardHeader className="p-5 border-b border-border/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg font-bold">Create a Group</CardTitle>
                                            <CardDescription className="text-xs mt-0.5">Pick members and set the monthly amount.</CardDescription>
                                        </div>
                                        <button onClick={() => setIsCreating(false)} className="p-2 rounded-lg hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <form onSubmit={submit} className="space-y-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Group Name</Label>
                                                <Input 
                                                    placeholder="e.g., Family Savings" 
                                                    value={data.name} 
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="h-11 rounded-xl"
                                                />
                                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Monthly Amount (MAD)</Label>
                                                <Input 
                                                    type="number" placeholder="Min 100" 
                                                    value={data.monthly_amount} 
                                                    onChange={e => setData('monthly_amount', e.target.value)}
                                                    className="h-11 rounded-xl"
                                                />
                                                {errors.monthly_amount && <p className="text-xs text-destructive">{errors.monthly_amount}</p>}
                                            </div>
                                        </div>

                                        {/* Member Search */}
                                        <div className="space-y-3">
                                            <Label>Add Members ({selectedUsers.length} selected)</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="Search by name..." 
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className="h-11 pl-10 rounded-xl"
                                                />
                                            </div>

                                            {/* Selected members chips */}
                                            {selectedUsers.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedUsers.map(uid => {
                                                        const u = allUsers.find(x => x.id === uid);
                                                        return u ? (
                                                            <Badge key={uid} className="bg-primary/10 text-primary border-none px-3 py-1.5 rounded-lg text-xs font-medium">
                                                                {u.first_name} {u.last_name}
                                                                <button onClick={() => removeUser(uid)} className="ml-2 hover:text-destructive"><X className="h-3 w-3" /></button>
                                                            </Badge>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}

                                            {/* Search results */}
                                            {searchQuery && (
                                                <div className="max-h-40 overflow-y-auto border border-border rounded-xl divide-y divide-border/50">
                                                    {filteredUsers.length === 0 ? (
                                                        <p className="p-3 text-xs text-muted-foreground text-center">No users found</p>
                                                    ) : (
                                                        filteredUsers.slice(0, 10).map(user => (
                                                            <button
                                                                key={user.id}
                                                                type="button"
                                                                onClick={() => { toggleUser(user.id); setSearchQuery(''); }}
                                                                className="w-full flex items-center gap-3 p-3 text-sm hover:bg-muted/50 transition-colors text-left"
                                                            >
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                                    {user.first_name.charAt(0)}
                                                                </div>
                                                                <span className="font-medium">{user.first_name} {user.last_name}</span>
                                                                <UserPlus className="h-4 w-4 text-muted-foreground ml-auto" />
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <Button disabled={processing || selectedUsers.length === 0} className="w-full h-12 rounded-xl font-bold">
                                            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
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
                        const currentMemberTurn = group.members.find(m => m.turn_order === group.current_round);
                        const myMemberInfo = group.members.find(m => m.user.id === auth.user.id);
                        const isMyTurn = currentMemberTurn?.user.id === auth.user.id;
                        const acceptedCount = group.members.filter(m => m.status === 'accepted').length;
                        const totalMembers = group.members.length;
                        const allAccepted = acceptedCount === totalMembers;

                        return (
                            <motion.div key={group.id} variants={item}>
                                <Card className="border border-border rounded-2xl shadow-sm h-full flex flex-col">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[10px] font-bold">
                                                {group.status === 'pending' ? `Waiting (${acceptedCount}/${totalMembers} joined)` : `Round ${group.current_round}/${group.cycle_duration_months}`}
                                            </Badge>
                                            <Badge className={`text-[10px] font-bold border-none ${group.status === 'active' ? 'bg-success/20 text-success' : group.status === 'pending' ? 'bg-warning/20 text-warning' : 'bg-muted'}`}>
                                                {group.status === 'active' ? 'Active' : group.status === 'pending' ? 'Pending' : 'Done'}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                                        <CardDescription className="text-xs">{group.monthly_amount} MAD / month · {totalMembers} members</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0 space-y-4 flex-1">
                                        {/* Current turn (only for active groups) */}
                                        {group.status === 'active' && (
                                            <div className={`p-3 rounded-xl border ${isMyTurn ? 'bg-primary/10 border-primary/20' : 'bg-muted/30 border-border/50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <Coins className={`h-5 w-5 ${isMyTurn ? 'text-primary' : 'text-muted-foreground'}`} />
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-medium">This month's turn</p>
                                                        <p className="text-sm font-bold">{isMyTurn ? 'Your turn! 🎉' : currentMemberTurn?.user.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Members list */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                <Users className="h-3 w-3" /> Members
                                            </p>
                                            <div className="space-y-1.5">
                                                {group.members.sort((a, b) => a.turn_order - b.turn_order).map(member => (
                                                    <div key={member.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${member.turn_order === group.current_round && group.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                                {member.turn_order}
                                                            </div>
                                                            <span className="text-sm font-medium">{member.user.name}</span>
                                                        </div>
                                                        <div>
                                                            {member.status === 'pending' ? (
                                                                <Badge className="bg-warning/20 text-warning border-none text-[9px]">Invited</Badge>
                                                            ) : member.status === 'declined' ? (
                                                                <Badge className="bg-destructive/20 text-destructive border-none text-[9px]">Declined</Badge>
                                                            ) : group.status === 'active' ? (
                                                                member.has_paid_current_round ? (
                                                                    <Badge className="bg-success/20 text-success border-none text-[9px]">Paid</Badge>
                                                                ) : (
                                                                    <Badge className="bg-muted text-muted-foreground border-none text-[9px]">Unpaid</Badge>
                                                                )
                                                            ) : (
                                                                <Badge className="bg-success/20 text-success border-none text-[9px]">Joined</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                    
                                    {/* Pay button (active groups only) */}
                                    {group.status === 'active' && myMemberInfo && (
                                        <div className="p-5 pt-0">
                                            <Button 
                                                onClick={() => handlePayment(group.id)} 
                                                disabled={myMemberInfo.has_paid_current_round}
                                                className="w-full h-11 rounded-xl font-bold"
                                                variant={myMemberInfo.has_paid_current_round ? "outline" : "default"}
                                            >
                                                {myMemberInfo.has_paid_current_round ? (
                                                    <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Already Paid</span>
                                                ) : (
                                                    <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Pay {group.monthly_amount} MAD</span>
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
                            <RotateCcw className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
                            <h3 className="text-lg font-bold text-muted-foreground/50">No groups yet</h3>
                            <p className="text-sm text-muted-foreground/30 mt-1">Create your first savings group to get started.</p>
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
