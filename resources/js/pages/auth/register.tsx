import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, User, Mail, Shield, Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Register(props: any) {
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        government_id: '',
        account: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account" />

            <div className="relative">
                {/* Visual Glow following focus */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            layoutId="glow-register"
                            className="absolute -inset-6 bg-primary/5 blur-3xl rounded-3xl -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </AnimatePresence>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <User className={`w-3 h-3 transition-colors ${isFocused === 'first_name' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="first_name" className="text-[10px] uppercase tracking-widest font-black text-white/40">First Name</Label>
                                </div>
                                <Input
                                    id="first_name"
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    onFocus={() => setIsFocused('first_name')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="first_name"
                                    placeholder="Anwar"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.first_name} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <User className={`w-3 h-3 transition-colors ${isFocused === 'last_name' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="last_name" className="text-[10px] uppercase tracking-widest font-black text-white/40">Last Name</Label>
                                </div>
                                <Input
                                    id="last_name"
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    onFocus={() => setIsFocused('last_name')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={2}
                                    autoComplete="last_name"
                                    placeholder="Atlas"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.last_name} />
                            </motion.div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <Mail className={`w-3 h-3 transition-colors ${isFocused === 'email' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black text-white/40">Email Address</Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setIsFocused('email')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    placeholder="anwar@atlaspay.ma"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.email} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <Zap className={`w-3 h-3 transition-colors ${isFocused === 'phone' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-black text-white/40">Phone Number</Label>
                                </div>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    onFocus={() => setIsFocused('phone')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={4}
                                    placeholder="+212"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.phone} />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-2"
                        >
                            <div className="flex items-center gap-2 px-1">
                                <Shield className={`w-3 h-3 transition-colors ${isFocused === 'address' ? 'text-primary' : 'text-white/20'}`} />
                                <Label htmlFor="address" className="text-[10px] uppercase tracking-widest font-black text-white/40">Home Address</Label>
                            </div>
                            <Input
                                id="address"
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                onFocus={() => setIsFocused('address')}
                                onBlur={() => setIsFocused(null)}
                                required
                                tabIndex={5}
                                placeholder="Street, City, Morocco"
                                className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                            />
                            <InputError message={errors.address} />
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <Shield className={`w-3 h-3 transition-colors ${isFocused === 'government_id' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="government_id" className="text-[10px] uppercase tracking-widest font-black text-white/40">Gov ID / CIN</Label>
                                </div>
                                <Input
                                    id="government_id"
                                    type="text"
                                    value={data.government_id}
                                    onChange={(e) => setData('government_id', e.target.value)}
                                    onFocus={() => setIsFocused('government_id')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={6}
                                    placeholder="AB123456"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.government_id} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="grid gap-2"
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <Shield className={`w-3 h-3 transition-colors ${isFocused === 'account' ? 'text-primary' : 'text-white/20'}`} />
                                    <Label htmlFor="account_type" className="text-[10px] uppercase tracking-widest font-black text-white/40">Account Tier</Label>
                                </div>
                                <Select
                                    required
                                    value={data.account}
                                    onValueChange={(val) => setData('account', val)}
                                >
                                    <SelectTrigger
                                        onFocus={() => setIsFocused('account')}
                                        onBlur={() => setIsFocused(null)}
                                        className="w-full h-12 bg-white/[0.02] border-white/5 focus:ring-primary/20 text-white rounded-xl transition-all"
                                    >
                                        <SelectValue placeholder="Select Tier" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                                        <SelectGroup>
                                            <SelectLabel className="text-[10px] uppercase tracking-[0.2em] text-white/30 px-3 py-2">Select Your Plan</SelectLabel>
                                            {props.accounts.map((account: any) => (
                                                <SelectItem key={account} value={account} className="focus:bg-primary focus:text-white transition-colors cursor-pointer rounded-lg mx-1">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3 text-primary" />
                                                        <span className="font-bold tracking-tight">{account}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="grid gap-2"
                            >
                                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-black text-white/40">Password</Label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setIsFocused('password')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.password} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="grid gap-2"
                            >
                                <Label htmlFor="password_confirmation" className="text-[10px] uppercase tracking-widest font-black text-white/40">Confirm Password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    onFocus={() => setIsFocused('password_confirmation')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    tabIndex={8}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-12 bg-white/[0.02] border-white/5 focus:border-primary/50 text-white rounded-xl transition-all"
                                />
                                <InputError message={errors.password_confirmation} />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-2"
                        >
                            <Button
                                type="submit"
                                className="relative w-full h-16 overflow-hidden bg-primary text-white hover:bg-success font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-elevated rounded-2xl group border-none"
                                tabIndex={6}
                                disabled={processing}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                <div className="relative flex items-center justify-center gap-3">
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-current group-hover:animate-pulse" />}
                                    <span>Create My Account</span>
                                </div>
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center"
                    >
                        <Link
                            href="/login"
                            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-all no-underline"
                        >
                            Already a member? <span className="text-primary group-hover:underline">Login Here</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </form>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                [data-slot="label"] {
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.2em !important;
                    font-weight: 900 !important;
                    color: rgba(255, 255, 255, 0.4) !important;
                }
            `}</style>
        </>
    );
}

Register.layout = {
    title: 'Create Account',
    description: 'Join AtlasPay and start banking',
};

