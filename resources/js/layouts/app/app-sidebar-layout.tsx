import { CustomSidebar } from '@/components/custom-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
    Zap
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import i18n from '@/i18n';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { props, url } = usePage();
    const sidebarOpen = (props as any).sidebarOpen ?? true;
    const auth = (props as any).auth;
    const currentLocale = (props as any).locale || 'en';
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        i18n.changeLanguage(currentLocale);
    }, [currentLocale]);

    useEffect(() => {
        if (auth?.user) {
            // Listen for transactions
            (window as any).Echo?.private(`App.Models.User.${auth.user.id}`)
                .listen('.transaction.created', (e: any) => {
                    toast.success(e.isIncoming ? `Money Received!` : `Money Sent!`, {
                        description: `${Number(e.transaction.amount).toLocaleString()} MAD - ${e.transaction.description}`,
                    });
                    setNotifications(prev => [e, ...prev]);
                });

            // Listen for Daret invitations
            (window as any).Echo?.private(`App.Models.User.${auth.user.id}`)
                .listen('.daret.invitation', (e: any) => {
                    toast.success(`New Daret Invitation!`, {
                        description: `${e.group.creator.first_name} invited you to join "${e.group.name}"`,
                        action: {
                            label: 'View',
                            onClick: () => (window as any).Inertia.visit('/daret')
                        }
                    });
                    setNotifications(prev => [e, ...prev]);
                });
        }

        return () => {
            if (auth?.user) {
                (window as any).Echo?.leave(`App.Models.User.${auth.user.id}`);
            }
        };
    }, [auth?.user]);

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div dir={currentLocale === 'ar' ? 'rtl' : 'ltr'} className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-500">
                {/* Desktop sidebar — hidden on mobile */}
                <div className="hidden md:block">
                    <CustomSidebar />
                </div>
                
                <main className="flex flex-1 flex-col overflow-hidden min-w-0">
                    {/* Compact top toolbar — search, notifications, theme */}
                    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:px-6">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <Zap className="h-3.5 w-3.5 fill-current" />
                            </div>
                            <span className="font-display text-sm font-bold tracking-tight uppercase">AtlasPay</span>
                        </div>
                        {/* Empty spacer on desktop */}
                        <div className="hidden md:block" />

                        <div className="flex items-center gap-2">
                            <button className="hidden md:inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Search className="h-3.5 w-3.5" />
                                <span>Search...</span>
                                <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                            </button>
                            
                            <LanguageSwitcher />

                            <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
                                <Bell className="h-4 w-4" />
                                {notifications.length > 0 && (
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive animate-pulse border-2 border-background" />
                                )}
                            </button>
                            <ThemeToggle />
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none pb-24 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                className="min-h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Mobile Bottom Nav Bar */}
                <div className="md:hidden fixed inset-x-0 bottom-0 z-50 pointer-events-none">
                    <div className="px-3 pb-3 pt-1 pointer-events-auto">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-full bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl p-1.5 flex items-center justify-around shadow-elevated"
                        >
                            <Link href="/dashboard" className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${url.startsWith('/dashboard') ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground'}`}>
                                <LayoutGrid className="h-5 w-5" />
                                <span className="text-[9px] font-bold">Home</span>
                            </Link>
                            <Link href="/reports/transactions" className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${url.startsWith('/reports') ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground'}`}>
                                <Activity className="h-5 w-5" />
                                <span className="text-[9px] font-bold">History</span>
                            </Link>
                            
                            <div className="relative -mt-8 px-1">
                                <Link href="/transfer" className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-4 border-background transition-transform active:scale-90">
                                    <Plus className="h-7 w-7" strokeWidth={3} />
                                </Link>
                            </div>

                            <Link href="/daret" className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${url.startsWith('/daret') ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground'}`}>
                                <Users className="h-5 w-5" />
                                <span className="text-[9px] font-bold">Daret</span>
                            </Link>
                            <Link href="/ai" className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${url.startsWith('/ai') ? 'text-primary bg-primary/10 font-bold' : 'text-muted-foreground'}`}>
                                <Bot className="h-5 w-5" />
                                <span className="text-[9px] font-bold">AI</span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
