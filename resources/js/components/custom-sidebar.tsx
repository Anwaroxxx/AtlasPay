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
    Target
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '@/hooks/use-appearance';

export function CustomSidebar() {
    const { url, props } = usePage();
    const { open, setOpen } = useSidebar();
    const { t } = useTranslation();
    const { appearance } = useAppearance();
    const isCollapsed = !open;
    const authUser = (props.auth as any)?.user;
    const displayName = authUser ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || authUser.name || authUser.email : 'User';

    const logoSrc = appearance === 'dark' 
        ? '/images/logos/darkmode-Photoroom.png' 
        : '/images/logos/lightmode-Photoroom.png';

    const navItems = [
        { title: t('dashboard', 'Dashboard'), href: '/dashboard', icon: LayoutGrid },
        { title: t('history', 'Transactions'), href: '/reports/transactions', icon: Activity },
        { title: t('send_money', 'Send Money'), href: '/transfer', icon: ArrowUpRight },
        { title: t('savings', 'Savings Goals'), href: '/savings', icon: Target },
        { title: t('credits_loans', 'Credits & Loans'), href: '/credits', icon: CreditCard },
        { title: t('daret', 'Daret Groups'), href: '/daret', icon: Users },
        { title: t('ai_assistant', 'AI Assistant'), href: '/ai', icon: Bot },
        { title: t('profile', 'My Profile'), href: '/settings/profile', icon: User },
    ];

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="sticky top-0 hidden md:flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-500 ease-in-out shrink-0 z-40"
        >
            {/* Logo Section */}
            <div className={`flex items-center px-6 ${isCollapsed ? 'justify-center h-20' : 'justify-start h-32'}`}>
                <div className="flex items-center gap-3">
                    <div className={`group relative flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isCollapsed ? 'h-12 w-12' : 'h-24 w-auto'}`}>
                        <img 
                            src={logoSrc} 
                            alt="AtlasPay Logo" 
                            className={`object-contain transition-all ${isCollapsed ? 'h-10 w-10' : 'h-24'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-8 px-4 py-6 overflow-y-auto scrollbar-none">
                <div className="space-y-1.5">
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('main_menu', 'Main Menu')}</p>
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
                                <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : ''}`} />
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
            <div className="p-4 mt-auto">
                <div className={`flex items-center gap-3 rounded-[1.25rem] bg-accent/30 p-2 hover:bg-accent/50 transition-colors border border-border/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <Link href="/settings/profile" className="flex items-center gap-3 overflow-hidden flex-1 group">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner group-hover:scale-105 transition-transform">
                            {authUser?.profile_photo ? (
                                <img src={authUser.profile_photo} alt={displayName} className="h-full w-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-bold text-foreground">{displayName}</span>
                                <span className="truncate text-[10px] font-medium text-muted-foreground">{authUser?.email}</span>
                            </div>
                        )}
                    </Link>
                    
                    {!isCollapsed && (
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
                className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:scale-110 hover:text-primary"
            >
                <ChevronRight className={`h-3 w-3 transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
        </motion.aside>
    );
}
