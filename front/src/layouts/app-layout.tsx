import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Outlet } from 'react-router-dom';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children?: React.ReactNode;
}) {
    const { url } = usePage();
    const isAiPage = url.startsWith('/ai');

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children || <Outlet />}
        </AppLayoutTemplate>
    );
}
