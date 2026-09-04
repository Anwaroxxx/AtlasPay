import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    ArrowUpRight,
    Activity,
    CreditCard,
    Plus,
    Users,
    Bot,
    Search,
    Bell,
    Zap,
    Target,
    User,
    X,
    Info,
    CheckCircle2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CustomSidebar } from '@/components/custom-sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommandPalette } from '@/components/command-palette';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import i18n from '@/i18n';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { props, url } = usePage();
    const { appearance } = useAppearance();
    const sidebarOpen = (props as any).sidebarOpen ?? true;
    const auth = (props as any).auth;
    const currentLocale = (props as any).locale || 'en';
    const [notifications, setNotifications] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`notifications_${auth?.user?.id}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            localStorage.setItem(`notifications_${auth.user.id}`, JSON.stringify(notifications));
        }
    }, [notifications, auth?.user]);

    useEffect(() => {
        i18n.changeLanguage(currentLocale);
    }, [currentLocale]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const echo = (window as any).Echo;
        if (auth?.user && echo) {
            const userChannel = `App.Models.User.${auth.user.id}`;
            console.log(`[Echo] 📡 Attempting to subscribe to: ${userChannel}`);

            const channel = echo.private(userChannel);

            // Connection debugging
            echo.connector.pusher.connection.bind('state_change', (states: any) => {
                console.log('[Echo] 🔌 Connection state:', states.current);
            });

            echo.connector.pusher.connection.bind('error', (err: any) => {
                console.error('[Echo] ❌ Connection error:', err);
            });

            channel.on('pusher:subscription_succeeded', () => {
                console.log(`[Echo] ✅ Successfully subscribed to ${userChannel}`);
            });

            channel.on('pusher:subscription_error', (status: any) => {
                console.error(`[Echo] ❌ Subscription error for ${userChannel}:`, status);
                toast.error('Real-time connection failed. Please refresh.');
            });

            channel.listen('.transaction.created', (e: any) => {
                console.log('[Echo] 💰 Transaction received:', e);
                const newNotification = {
                    ...e,
                    id: crypto.randomUUID(),
                    category: 'transaction',
                    timestamp: new Date(),
                };
                toast.success(
                    e.isIncoming ? `Money Received` : `Money Sent`,
                    {
                        description: `${Number(e.transaction.amount).toLocaleString()} MAD - ${e.transaction.description}`,
                    },
                );
                setNotifications((prev) => [newNotification, ...prev]);
            });

            channel.listen('.daret.invitation', (e: any) => {
                console.log('[Echo] 🤝 Daret invitation received:', e);
                const newNotification = {
                    ...e,
                    id: crypto.randomUUID(),
                    category: 'daret',
                    timestamp: new Date(),
                };
                toast.success(`New Daret Invitation`, {
                    description: `${e.group.creator.first_name} invited you to join "${e.group.name}"`,
                    action: {
                        label: 'View',
                        onClick: () => (window as any).Inertia.visit('/daret'),
                    },
                });
                setNotifications((prev) => [newNotification, ...prev]);
            });

            channel.listen('.notification.generic', (e: any) => {
                console.log('[Echo] 🔔 Generic notification received:', e);
                const newNotification = {
                    ...e,
                    id: crypto.randomUUID(),
                    category: 'generic',
                    timestamp: new Date(),
                };
                const toastType = e.type === 'warning' ? 'warning' : e.type === 'info' ? 'info' : 'success';
                (toast as any)[toastType](e.title, {
                    description: e.message,
                    action: e.actionUrl ? {
                        label: 'View',
                        onClick: () => (window as any).Inertia.visit(e.actionUrl),
                    } : undefined,
                });
                setNotifications((prev) => [newNotification, ...prev]);
            });

            return () => {
                console.log(`[Echo] 🚪 Leaving channel: ${userChannel}`);
                echo.leave(userChannel);
            };
        }
    }, [auth?.user]);

    const clearNotifications = () => setNotifications([]);
    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div
                dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
                className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-500"
            >
                {/* Desktop sidebar — hidden on mobile */}
                <div className="hidden md:block">
                    <CustomSidebar />
                </div>

                <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {/* Compact top toolbar — search, notifications, theme */}
                    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:px-6">
                        {/* Mobile logo added back */}
                        <div className="flex items-center gap-2 md:hidden">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <img 
                                    src="/images/logos/favicon.png" 
                                    alt="AtlasPay" 
                                    className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(118,177,130,0.3)]"
                                />
                                <span className="font-display text-lg font-black tracking-tighter text-foreground uppercase">
                                    Atlas<span className="text-primary italic">Pay.</span>
                                </span>
                            </Link>
                        </div>
                        {/* Empty spacer on desktop */}
                        <div className="hidden md:block" />

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground active:scale-95 md:inline-flex"
                            >
                                <Search className="h-3.5 w-3.5" />
                                <span>Search...</span>
                                <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px] font-black tracking-widest">
                                    ⌘K
                                </kbd>
                            </button>

                            <LanguageSwitcher />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                        aria-label="Notifications"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-2.5 right-2.5 h-2 w-2 animate-pulse rounded-full border-2 border-background bg-destructive" />
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b">
                                        <DropdownMenuLabel className="p-0 font-display text-xs font-black uppercase tracking-widest opacity-60">
                                            Notifications
                                        </DropdownMenuLabel>
                                        {notifications.length > 0 && (
                                            <button 
                                                onClick={clearNotifications}
                                                className="text-[10px] font-black uppercase tracking-tighter text-destructive hover:underline"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                                <div className="mb-4 rounded-full bg-primary/10 p-3">
                                                    <Bell className="h-6 w-6 text-primary opacity-20" />
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                                    All caught up!
                                                </p>
                                                <p className="mt-1 text-[10px] text-muted-foreground opacity-60">
                                                    No new notifications to show right now.
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <DropdownMenuItem 
                                                    key={n.id} 
                                                    className="relative flex cursor-pointer items-start gap-3 border-b border-border/30 p-4 last:border-0 hover:bg-muted/50 focus:bg-muted/50"
                                                >
                                                    <div className={`mt-0.5 rounded-full p-2 ${
                                                        n.category === 'transaction' 
                                                            ? (n.isIncoming ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500')
                                                            : n.category === 'daret'
                                                            ? 'bg-primary/10 text-primary'
                                                            : n.type === 'warning'
                                                            ? 'bg-destructive/10 text-destructive'
                                                            : 'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                        {n.category === 'transaction' ? (
                                                            <Activity className="h-3.5 w-3.5" />
                                                        ) : n.category === 'daret' ? (
                                                            <Users className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Info className="h-3.5 w-3.5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-[11px] font-black uppercase tracking-tight text-foreground">
                                                                {n.category === 'transaction' 
                                                                    ? (n.isIncoming ? 'Payment Received' : 'Payment Sent')
                                                                    : n.category === 'daret'
                                                                    ? 'Daret Invitation'
                                                                    : n.title}
                                                            </p>
                                                            <span className="text-[9px] font-bold text-muted-foreground opacity-40">
                                                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="line-clamp-2 text-[10px] font-medium leading-relaxed text-muted-foreground">
                                                            {n.category === 'transaction' 
                                                                ? `${Number(n.transaction.amount).toLocaleString()} MAD - ${n.transaction.description}`
                                                                : n.category === 'daret'
                                                                ? `${n.group.creator.first_name} invited you to join "${n.group.name}"`
                                                                : n.message}
                                                        </p>
                                                        {(n.category === 'daret' || (n.category === 'generic' && n.actionUrl)) && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    (window as any).Inertia.visit(n.category === 'daret' ? '/daret' : n.actionUrl);
                                                                }}
                                                                className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                                                            >
                                                                View Details <ArrowUpRight className="h-2.5 w-2.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(n.id);
                                                        }}
                                                        className="absolute top-4 right-2 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="bg-muted/30 p-2 text-center">
                                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                                End of notifications
                                            </p>
                                        </div>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <ThemeToggle />
                        </div>
                    </header>

                    <div className="scrollbar-none relative flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={url}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { 
                                        opacity: 1, 
                                        y: 0,
                                        transition: {
                                            duration: 0.5,
                                            ease: [0.23, 1, 0.32, 1],
                                            staggerChildren: 0.1
                                        }
                                    },
                                    exit: { 
                                        opacity: 0, 
                                        y: -10,
                                        transition: {
                                            duration: 0.3,
                                            ease: [0.23, 1, 0.32, 1]
                                        }
                                    }
                                }}
                                className="min-h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Mobile Bottom Nav Bar */}
                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
                    <div className="pointer-events-auto px-3 pt-1 pb-3">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="shadow-elevated flex w-full items-center justify-around rounded-2xl border border-border/50 bg-card/90 p-1.5 backdrop-blur-2xl"
                        >
                            <Link
                                href="/settings/profile"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/settings/profile') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <User className="h-5 w-5" />
                                <span className="text-[9px] font-bold">
                                    Profile
                                </span>
                            </Link>
                            <Link
                                href="/credits"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/credits') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <CreditCard className="h-5 w-5" />
                                <span className="text-[9px] font-bold">
                                    Credits
                                </span>
                            </Link>

                            <Link
                                href="/reports/transactions"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/reports') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <Activity className="h-5 w-5" />
                                <span className="text-[9px] font-bold">
                                    History
                                </span>
                            </Link>

                            <div className="relative -mt-8 px-1">
                                <Link
                                    href="/dashboard"
                                    className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg transition-transform active:scale-90"
                                >
                                    <LayoutGrid className="h-7 w-7" />
                                </Link>
                            </div>

                            <Link
                                href="/savings"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/savings') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <Target className="h-5 w-5" />
                                <span className="text-[9px] font-bold">
                                    Saving Goals
                                </span>
                            </Link>
                            <Link
                                href="/daret"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/daret') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <Users className="h-5 w-5" />
                                <span className="text-[9px] font-bold">
                                    Daret
                                </span>
                            </Link>
                            <Link
                                href="/ai"
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${url.startsWith('/ai') ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                            >
                                <Bot className="h-5 w-5" />
                                <span className="text-[9px] font-bold">AI</span>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <CommandPalette isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
            </div>
        </SidebarProvider>
    );
}
