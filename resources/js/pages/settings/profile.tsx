import { Head, usePage, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    User, 
    Mail, 
    ShieldCheck, 
    BadgeCheck, 
    ShieldAlert, 
    CreditCard, 
    Activity,
    Lock,
    Phone,
    MapPin,
    Fingerprint,
    TrendingUp,
    Camera
} from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    Tooltip 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Profile() {
    const { auth, spendingData, securityHistory } = usePage().props as any;
    const user = auth.user;

    const { data, setData, patch, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="My Profile" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-10 p-4 md:p-8 max-w-7xl mx-auto"
            >
                {/* Stunning Profile Header */}
                <motion.div variants={item} className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-neutral-900 p-5 md:p-8 text-white shadow-2xl dark:bg-[#0a0a0a]">
                    <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
                    
                    <div className="relative z-10 flex flex-col gap-6 md:gap-8 md:flex-row md:items-center">
                        <div className="relative group">
                            <div className="h-20 w-20 md:h-32 md:w-32 rounded-2xl md:rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-3xl md:text-5xl font-black text-neutral-900 shadow-2xl border-4 border-white/10 overflow-hidden">
                                {(user.first_name || 'U').charAt(0)}
                            </div>
                            <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tighter sm:text-4xl md:text-5xl">{user.first_name} {user.last_name}</h1>
                                <Badge className="bg-emerald-500 text-neutral-900 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                                    Verified Platinum
                                </Badge>
                            </div>
                            <p className="text-neutral-400 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> {user.email}
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    <p className="text-[10px] uppercase font-bold text-neutral-500">Security Score</p>
                                    <p className="text-xl font-black text-emerald-400">98%</p>
                                </div>
                                <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    <p className="text-[10px] uppercase font-bold text-neutral-500">Trust Level</p>
                                    <p className="text-xl font-black text-blue-400">High</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Left & Middle Columns: Profile Details & Activity */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Profile Form Card */}
                        <motion.div variants={item}>
                            <Card className="border-none shadow-2xl bg-white dark:bg-neutral-900/50 rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 border-b border-neutral-50 dark:border-neutral-800">
                                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                                        <Fingerprint className="h-6 w-6 text-emerald-500" />
                                        Identity Profile
                                    </CardTitle>
                                    <CardDescription>Update your personal and contact information.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={submit} className="space-y-8">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-neutral-400 ml-1">First Name</Label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    <Input
                                                        value={data.first_name}
                                                        onChange={e => setData('first_name', e.target.value)}
                                                        className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/10 text-md font-bold"
                                                    />
                                                </div>
                                                <InputError message={errors.first_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-neutral-400 ml-1">Last Name</Label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    <Input
                                                        value={data.last_name}
                                                        onChange={e => setData('last_name', e.target.value)}
                                                        className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/10 text-md font-bold"
                                                    />
                                                </div>
                                                <InputError message={errors.last_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-neutral-400 ml-1">Email Address</Label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    <Input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/10 text-md font-bold"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-neutral-400 ml-1">Phone Number</Label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    <Input
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/10 text-md font-bold"
                                                    />
                                                </div>
                                                <InputError message={errors.phone} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-neutral-400 ml-1">Home Address</Label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <Input
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:ring-emerald-500/10 text-md font-bold"
                                                />
                                            </div>
                                            <InputError message={errors.address} />
                                        </div>

                                        <Button disabled={processing} className="w-full h-14 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 text-lg font-black shadow-xl hover:scale-[1.02] transition-transform">
                                            Update Identity Profile
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Visual Behavior Cards */}
                        <div className="grid gap-8 md:grid-cols-2">
                            <motion.div variants={item}>
                                <Card className="border-none shadow-xl h-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-emerald-500" />
                                            Spending Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={spendingData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {spendingData.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase text-neutral-500">
                                            {spendingData.map((entry: any, index: number) => (
                                                <div key={entry.name} className="flex items-center gap-1">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    {entry.name}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={item}>
                                <Card className="border-none shadow-xl h-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-blue-500" />
                                            Security Stability
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={securityHistory}>
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                                <YAxis hide domain={[90, 100]} />
                                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="score" 
                                                    stroke="#3b82f6" 
                                                    strokeWidth={4} 
                                                    dot={{ fill: '#3b82f6', r: 4 }} 
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Security & Status */}
                    <div className="space-y-10">
                        {/* Protection Badge */}
                        <motion.div variants={item}>
                            <Card className="border-none shadow-2xl bg-neutral-900 text-white rounded-[2.5rem] overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Bank-Grade Protection
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                            <BadgeCheck className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black">Status: Secure</p>
                                            <p className="text-xs text-neutral-500">Tier 3 Platinum Protocol</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase text-neutral-500">Global Score</span>
                                            <span className="text-2xl font-black text-emerald-400">98.4</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '98.4%' }}
                                                className="h-full bg-emerald-500" 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-4">
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                                            <span className="text-neutral-500">2FA Status</span>
                                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none">ENABLED</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                                            <span className="text-neutral-500">Encryption</span>
                                            <span className="font-bold">256-bit AES</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={item} className="space-y-4">
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-neutral-100 bg-white dark:bg-neutral-900 dark:border-neutral-800 font-bold flex justify-between px-6 group">
                                <span className="flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-neutral-400 group-hover:text-emerald-500" />
                                    Change Security Key
                                </span>
                                <Badge variant="outline" className="text-[8px] font-black">RESET</Badge>
                            </Button>
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-neutral-100 bg-white dark:bg-neutral-900 dark:border-neutral-800 font-bold flex justify-between px-6 group">
                                <span className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-neutral-400 group-hover:text-blue-500" />
                                    Account Audit Log
                                </span>
                                <Badge variant="outline" className="text-[8px] font-black">VIEW</Badge>
                            </Button>
                        </motion.div>

                        {/* Danger Area */}
                        <motion.div variants={item}>
                            <Card className="border-none shadow-lg bg-rose-50/30 dark:bg-rose-950/5 rounded-[2.5rem]">
                                <CardHeader>
                                    <CardTitle className="text-rose-600 dark:text-rose-400 text-sm font-black flex items-center gap-2 uppercase tracking-widest">
                                        <ShieldAlert className="h-4 w-4" />
                                        Close Account
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-neutral-500 mb-6 font-medium leading-relaxed">
                                        Permanently delete your bank profile and vault access. This action cannot be undone.
                                    </p>
                                    <DeleteUser />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'My Profile',
            href: '/settings/profile',
        },
    ],
};
