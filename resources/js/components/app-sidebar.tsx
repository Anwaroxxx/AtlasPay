import { Link as InertiaLink } from '@inertiajs/react';
import {
    LayoutGrid,
    Target,
    RotateCcw,
    BrainCircuit,
    History,
    CreditCard,
    Wallet,
    Link,
} from 'lucide-react';
import { FolderGit2, BookOpen } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Transactions',
        href: '/reports/transactions',
        icon: History,
    },
    {
        title: 'Send Money',
        href: '/transfer',
        icon: Wallet,
    },
    {
        title: 'Savings',
        href: '/savings',
        icon: Target,
    },
    {
        title: 'Daret Groups',
        href: '/daret',
        icon: RotateCcw,
    },
    {
        title: 'Credits & Loans',
        href: '/credits',
        icon: CreditCard,
    },
    {
        title: 'SmartBanking AI',
        href: '/anwar',
        icon: BrainCircuit,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/ayoub-ennaciri/bank-chafara',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <InertiaLink href={dashboard()} prefetch>
                                <AppLogo />
                            </InertiaLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
