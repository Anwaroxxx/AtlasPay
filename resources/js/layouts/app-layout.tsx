import { BankBot } from '@/components/bank-bot';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { url } = usePage();
    const isAiPage = url.startsWith('/ai');

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
            {!isAiPage && <BankBot />}
        </AppLayoutTemplate>
    );
}
