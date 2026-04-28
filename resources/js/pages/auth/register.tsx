import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register(props) {
    // console.log(props.accounts);
   
    
    
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'phone', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">Fisrt name</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="first_name"
                                    name="first_name"
                                    placeholder="First name"
                                />
                                <InputError
                                    message={errors.First_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="">
                                <Label htmlFor="account_type">
                                    Account type{' '}
                                </Label>

                                <Select required
                                name='account'
                                >
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Select a an account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            {props.accounts.map((account)=>
                                            {
                                                return(
                                                    <SelectItem value={account}>{account}</SelectItem>  

                                                )
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last name</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="last_name"
                                    name="last_name"
                                    placeholder="Last name"
                                />
                                <InputError
                                    message={errors.Last_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={4}
                                    autoComplete="phone"
                                    name="phone"
                                    placeholder="+212XXXXXXXXX"
                                    // value="+212612345678"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="address"
                                    name="address"
                                    placeholder="Enter you address"
                                />
                                <InputError
                                    message={errors.Last_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="goverment_id">
                                    Goverment ID
                                </Label>
                                <Input
                                    id="goverment_id"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="goverment_id"
                                    name="goverment_id"
                                    placeholder="Enter you goverment_id"
                                />
                                <InputError
                                    message={errors.Last_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
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
