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
import { cn } from '@/lib/utils';

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

    const iconLogo = '/images/logos/favicon.png';

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
            animate={{ width: isCollapsed ? 84 : 280 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-colors duration-500 md:flex"
        >
            <div className="moroccan-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.015]" />

            {/* Logo Section */}
            <div
                className={`relative z-10 flex items-center px-6 ${isCollapsed ? 'h-24 justify-center' : 'h-36 justify-start'}`}
            >
                <div className="flex w-full items-center justify-center">
                    <motion.div
                        layout
                        className={`group relative flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isCollapsed ? 'h-14 w-14' : 'h-32 w-full'}`}
                    >
                        <AnimatePresence mode="wait">
                            {isCollapsed ? (
                                <motion.img
                                    key="icon-logo"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    src={iconLogo}
                                    alt="AtlasPay Icon"
                                    className="h-12 w-12 object-contain drop-shadow-[0_0_15px_rgba(118,177,130,0.3)]"
                                />
                            ) : (
                                <motion.img
                                    key="full-logo"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    src={logoSrc}
                                    alt="AtlasPay Logo"
                                    className="h-28 w-full object-contain"
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Navigation */}
            <div className="scrollbar-none relative z-10 flex-1 space-y-8 overflow-y-auto px-4 py-6">
                <div className="space-y-1.5">
                    {!isCollapsed && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 px-3 text-[10px] font-black tracking-[0.3em] text-primary uppercase"
                        >
                            {t('main_menu', 'Main Menu')}
                        </motion.p>
                    )}
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3.5 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                                }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : ''}`}
                                />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-sm font-black tracking-tight uppercase"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                                    />
                                )}
                                {isCollapsed && isActive && (
                                    <motion.div 
                                        layoutId="active-line-collapsed"
                                        className="absolute left-1.5 top-3 bottom-3 w-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(118,177,130,0.6)]" 
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-auto p-4">
                <div
                    className={`flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-2 transition-all hover:bg-primary/10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <Link
                        href="/settings/profile"
                        className="group flex flex-1 items-center gap-3 overflow-hidden"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
                            {authUser?.profile_photo ? (
                                <img
                                    src={authUser.profile_photo}
                                    alt={displayName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="font-black">{displayName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-xs font-black text-foreground uppercase tracking-tight">
                                    {displayName}
                                </span>
                                <span className="truncate text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
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
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-destructive hover:text-white"
                            title="Sign Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Refined Emerald Handle Toggle */}
            <motion.button
                whileHover={{ width: 28, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-24 z-50 flex h-14 w-6 items-center justify-center rounded-r-xl border border-l-0 border-primary/20 bg-primary/10 text-primary shadow-lg backdrop-blur-xl transition-all hover:bg-primary hover:text-white"
            >
                <div className="absolute left-1 top-2 bottom-2 w-[1.5px] rounded-full bg-primary/30 group-hover:bg-white/40" />
                <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <ChevronRight className="h-3.5 w-3.5 stroke-[3px]" />
                </motion.div>
            </motion.button>
        </motion.aside>
    );
}
