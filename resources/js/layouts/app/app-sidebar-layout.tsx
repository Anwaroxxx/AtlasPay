import { CustomSidebar } from '@/components/custom-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
    Menu, 
    X, 
    LayoutGrid, 
    ArrowUpRight, 
    Activity, 
    CreditCard, 
    User, 
    Settings, 
    LogOut,
    Zap 
} from 'lucide-react';

const mobileNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Transfer', href: '/transfer', icon: ArrowUpRight },
    { title: 'Transactions', href: '/reports/transactions', icon: Activity },
    { title: 'Credits', href: '/credits', icon: CreditCard },
    { title: 'My Profile', href: '/settings/profile', icon: User },
    { title: 'Security', href: '/settings/security', icon: Settings },
];

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { props, url } = usePage();
    const sidebarOpen = (props as any).sidebarOpen ?? true;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div className="flex min-h-screen w-full bg-white dark:bg-neutral-950">
                <CustomSidebar />
                
                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed left-0 top-0 z-[70] h-full w-72 bg-white dark:bg-[#050505] shadow-2xl md:hidden flex flex-col"
                            >
                                {/* Mobile Logo */}
                                <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-900">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-emerald-500">
                                            <Zap className="h-4 w-4 fill-current" />
                                        </div>
                                        <span className="text-lg font-black tracking-tighter text-neutral-900 dark:text-white">Atlas<span className="text-emerald-500">Pay</span></span>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                        <X className="h-5 w-5 text-neutral-400" />
                                    </button>
                                </div>

                                {/* Mobile Nav */}
                                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                                    {mobileNavItems.map((item) => {
                                        const isActive = url.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                                                    isActive
                                                    ? 'bg-emerald-500 text-neutral-900 font-bold shadow-lg'
                                                    : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                <span className="text-sm font-bold">{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Mobile Logout */}
                                <div className="p-4 border-t border-neutral-100 dark:border-neutral-900">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 py-3 text-xs font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main className="flex flex-1 flex-col overflow-hidden min-w-0">
                    {/* Mobile Header Bar */}
                    <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 sticky top-0 z-50">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <Menu className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-emerald-500">
                                <Zap className="h-4 w-4 fill-current" />
                            </div>
                            <span className="text-sm font-black tracking-tighter text-neutral-900 dark:text-white">Atlas<span className="text-emerald-500">Pay</span></span>
                        </div>
                        <div className="w-9" /> {/* Spacer for centering */}
                    </div>

                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="min-h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}


