import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    Settings,
    User,
    LogOut,
    ChevronRight,
    Activity,
    CreditCard,
    Zap,
    Shield,
    ArrowUpRight,
    Users,
    Bot,
    Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';

export function CustomSidebar() {
    const { url, props } = usePage();
    const { open, setOpen } = useSidebar();
    const { t } = useTranslation();
    const { appearance } = useAppearance();
    const isCollapsed = !open;
    const authUser = (props.auth as any)?.user;
    const displayName = authUser
        ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() ||
          authUser.name ||
          authUser.email
        : 'User';

    const logoSrc =
        appearance === 'dark'
            ? '/images/logos/darkmode-Photoroom.png'
            : '/images/logos/lightmode-Photoroom.png';

    const navItems = [
        {
            title: t('dashboard', 'Dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('history', 'Transactions'),
            href: '/reports/transactions',
            icon: Activity,
        },
        {
            title: t('send_money', 'Send Money'),
            href: '/transfer',
            icon: ArrowUpRight,
        },
        {
            title: t('savings', 'Savings Goals'),
            href: '/savings',
            icon: Target,
        },
        {
            title: t('credits_loans', 'Credits & Loans'),
            href: '/credits',
            icon: CreditCard,
        },
        { title: t('daret', 'Daret Groups'), href: '/daret', icon: Users },
        { title: t('ai_assistant', 'AI Assistant'), href: '/ai', icon: Bot },
        {
            title: t('profile', 'My Profile'),
            href: '/settings/profile',
            icon: User,
        },
    ];

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-500 ease-in-out md:flex"
        >
            {/* Logo Section */}
            <div
                className={`flex items-center px-6 ${isCollapsed ? 'h-20 justify-center' : 'h-32 justify-start'}`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`group relative flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isCollapsed ? 'h-12 w-12' : 'h-24 w-auto'}`}
                    >
                        <img
                            src={logoSrc}
                            alt="AtlasPay Logo"
                            className={`object-contain transition-all ${isCollapsed ? 'h-10 w-10' : 'h-24'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="scrollbar-none flex-1 space-y-8 overflow-y-auto px-4 py-6">
                <div className="space-y-1.5">
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            {t('main_menu', 'Main Menu')}
                        </p>
                    )}
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : ''}`}
                                />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm font-semibold tracking-tight"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-dot"
                                        className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary-foreground"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4">
                <div
                    className={`flex items-center gap-3 rounded-[1.25rem] border border-border/50 bg-accent/30 p-2 transition-colors hover:bg-accent/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <Link
                        href="/settings/profile"
                        className="group flex flex-1 items-center gap-3 overflow-hidden"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-bold text-primary shadow-inner transition-transform group-hover:scale-105">
                            {authUser?.profile_photo ? (
                                <img
                                    src={authUser.profile_photo}
                                    alt={displayName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-bold text-foreground">
                                    {displayName}
                                </span>
                                <span className="truncate text-[10px] font-medium text-muted-foreground">
                                    {authUser?.email}
                                </span>
                            </div>
                        )}
                    </Link>

                    {!isCollapsed && (
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Sign Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-20 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:scale-110 hover:text-primary"
            >
                <ChevronRight
                    className={`h-3 w-3 transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`}
                />
            </button>
        </motion.aside>
    );
}
