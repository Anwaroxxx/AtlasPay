import { Form, Head } from '@inertiajs/react';
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
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register(props) {
    // console.log(props.accounts);
   
    
    
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'phone', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-3"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="first_name">First name</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="first_name"
                                        name="first_name"
                                        placeholder="First name"
                                        className="h-9"
                                    />
                                    <InputError message={errors.first_name} className="text-[10px] mt-0" />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="last_name"
                                        name="last_name"
                                        placeholder="Last name"
                                        className="h-9"
                                    />
                                    <InputError message={errors.last_name} className="text-[10px] mt-0" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={3}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="h-9"
                                    />
                                    <InputError message={errors.email} className="text-[10px] mt-0" />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        tabIndex={4}
                                        autoComplete="phone"
                                        name="phone"
                                        placeholder="+212XXXXXXXXX"
                                        className="h-9"
                                    />
                                    <InputError message={errors.phone} className="text-[10px] mt-0" />
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="account_type">Account type</Label>
                                <Select required name="account">
                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Select an account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Available Tiers</SelectLabel>
                                            {props.accounts.map((account) => (
                                                <SelectItem key={account} value={account}>{account}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="goverment_id">Gov ID</Label>
                                    <Input
                                        id="goverment_id"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="goverment_id"
                                        name="goverment_id"
                                        placeholder="ID Number"
                                        className="h-9"
                                    />
                                    <InputError message={errors.goverment_id} className="text-[10px] mt-0" />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="address"
                                        name="address"
                                        placeholder="City, Morocco"
                                        className="h-9"
                                    />
                                    <InputError message={errors.address} className="text-[10px] mt-0" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="password">Password</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="h-9"
                                    />
                                    <InputError message={errors.password} className="text-[10px] mt-0" />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="password_confirmation">Confirm</Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className="h-9"
                                    />
                                    <InputError message={errors.password_confirmation} className="text-[10px] mt-0" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 rounded-xl bg-emerald-500 text-neutral-900 hover:bg-emerald-400 font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Begin Journey
                            </Button>
                        </div>


                        <div className="text-center text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-emerald-500 hover:text-emerald-400 transition-colors">
                                Access Vault
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
