import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { Outlet } from 'react-router-dom';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {children || <Outlet />}
        </AuthLayoutTemplate>
    );
}
