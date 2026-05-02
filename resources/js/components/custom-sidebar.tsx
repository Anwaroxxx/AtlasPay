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
    Shield
} from 'lucide-react';
import { dashboard, logout } from '@/routes';
import { UserInfo } from '@/components/user-info';
import { useSidebar } from '@/components/ui/sidebar';

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Transactions', href: '/reports/transactions', icon: Activity },
    { title: 'Credits', href: '/credits', icon: CreditCard },
    { title: 'My Profile', href: '/settings/profile', icon: User },
    { title: 'Security', href: '/settings/security', icon: Settings },
];

export function CustomSidebar() {
    const { url, props } = usePage();
    const { open, setOpen } = useSidebar();
    const isCollapsed = !open;
    const authUser = (props.auth as any)?.user;

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 100 : 300 }}
            className="relative flex h-screen flex-col border-r border-neutral-100 bg-white dark:border-neutral-900 dark:bg-[#050505] transition-all duration-500 ease-in-out"
        >
            {/* Premium Logo Section */}
            <div className={`flex h-24 items-center px-8 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
                <div className="flex items-center gap-4">
                    <div className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-emerald-500 shadow-2xl transition-all hover:scale-110 active:scale-95">
                        <Zap className="h-6 w-6 fill-current" />
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
                    </div>
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col"
                            >
                                <span className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">Atlas<span className="text-emerald-500">Pay</span></span>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">Digital Vault v2</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Premium Navigation */}
            <nav className="flex-1 space-y-3 px-6 py-10">
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`group relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 ${
                                isActive 
                                ? 'bg-emerald-500 text-neutral-900 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]' 
                                : 'text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'stroke-[3px]' : ''}`} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-black tracking-tight"
                                >
                                    {item.title}
                                </motion.span>
                            )}
                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="active-glow"
                                    className="absolute right-4 h-1.5 w-1.5 rounded-full bg-neutral-900"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Premium Footer */}
            <div className="p-6">
                <div className={`flex flex-col gap-4 rounded-[2.5rem] bg-neutral-50 p-4 dark:bg-white/5 ${isCollapsed ? 'items-center' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/20 p-1">
                            <UserInfo user={authUser} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-black text-neutral-900 dark:text-white">{authUser?.name}</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                    <Shield className="h-2 w-2" /> Verified
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-3 text-xs font-black text-rose-500 shadow-sm transition-all hover:bg-rose-50 dark:bg-neutral-900 dark:hover:bg-rose-950/20"
                        >
                            <LogOut className="h-4 w-4" />
                            SIGN OUT
                        </Link>
                    )}
                </div>
            </div>

            {/* Collapse Toggle Overlay */}
            <button 
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 shadow-xl transition-all hover:scale-110 hover:text-emerald-500 dark:border-neutral-800 dark:bg-neutral-950"
            >
                <ChevronRight className={`h-3 w-3 transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
        </motion.aside>
    );
}
