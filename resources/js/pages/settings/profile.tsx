import { Head, usePage, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Camera, Loader2, Trash2, Lock, Save } from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRef } from 'react';

export default function Profile() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const photoInput = useRef<HTMLInputElement>(null);

    // Profile info form
    const { data, setData, patch, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        government_id: user.government_id || '',
    });

    // Password form
    const password = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile');
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        password.put('/settings/security', {
            onSuccess: () => password.reset(),
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        router.post('/settings/profile/photo', formData, {
            forceFormData: true,
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="My Profile" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-3xl mx-auto w-full"
            >
                {/* Profile Header */}
                <motion.div variants={item} className="flex flex-col items-center gap-4 py-6">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg overflow-hidden border-4 border-background">
                            {user.profile_photo ? (
                                <img src={user.profile_photo} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                (user.first_name || 'U').charAt(0)
                            )}
                        </div>
                        <button 
                            onClick={() => photoInput.current?.click()}
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center hover:scale-110 transition-transform border-2 border-background"
                        >
                            <Camera className="h-3.5 w-3.5" />
                        </button>
                        <input 
                            ref={photoInput}
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoChange} 
                            className="hidden" 
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </motion.div>

                {/* Edit Name */}
                <motion.div variants={item}>
                    <Card className="border border-border rounded-2xl shadow-sm">
                        <CardHeader className="p-5 pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Personal Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <form onSubmit={submitProfile} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            className="h-11 rounded-xl"
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            className="h-11 rounded-xl"
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="h-11 rounded-xl"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="h-11 rounded-xl"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Home Address</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="h-11 rounded-xl"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="government_id">Government ID (CIN/Passport)</Label>
                                    <Input
                                        id="government_id"
                                        value={data.government_id}
                                        onChange={e => setData('government_id', e.target.value)}
                                        className="h-11 rounded-xl"
                                        disabled
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Government ID cannot be changed once verified.</p>
                                    <InputError message={errors.government_id} />
                                </div>

                                <Button disabled={processing} className="h-11 rounded-xl px-6">
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Change Password */}
                <motion.div variants={item}>
                    <Card className="border border-border rounded-2xl shadow-sm">
                        <CardHeader className="p-5 pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Change Password
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <form onSubmit={submitPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Current Password</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={password.data.current_password}
                                        onChange={e => password.setData('current_password', e.target.value)}
                                        className="h-11 rounded-xl"
                                        placeholder="••••••••"
                                    />
                                    <InputError message={password.errors.current_password} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            value={password.data.password}
                                            onChange={e => password.setData('password', e.target.value)}
                                            className="h-11 rounded-xl"
                                            placeholder="••••••••"
                                        />
                                        <InputError message={password.errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={password.data.password_confirmation}
                                            onChange={e => password.setData('password_confirmation', e.target.value)}
                                            className="h-11 rounded-xl"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <Button disabled={password.processing} variant="outline" className="h-11 rounded-xl px-6">
                                    <Lock className="h-4 w-4 mr-2" />
                                    {password.processing ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Delete Account */}
                <motion.div variants={item}>
                    <Card className="border border-destructive/20 rounded-2xl shadow-sm bg-destructive/5">
                        <CardHeader className="p-5 pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">
                                Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                            </p>
                            <DeleteUser />
                        </CardContent>
                    </Card>
                </motion.div>
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
