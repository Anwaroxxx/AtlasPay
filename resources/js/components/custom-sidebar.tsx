import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutGrid, 
    Settings, 
    User, 
    LogOut, 
    ChevronRight
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
    { title: 'Profile', href: '/settings/profile', icon: User },
    { title: 'Security', href: '/settings/security', icon: Settings },
];

export function CustomSidebar() {
    const { url, props } = usePage();
    const { open, setOpen } = useSidebar();
    const isCollapsed = !open;
    const authUser = (props.auth as any)?.user;


    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="relative flex h-screen flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300"
        >
            {/* Logo Section */}
            <div className="flex h-20 items-center justify-between px-6">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900">
                                <span className="text-lg font-bold italic">A</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">AtlasPay</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button 
                    onClick={() => setOpen(!open)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-2 px-4 py-6">
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                                isActive 
                                ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 shadow-sm' 
                                : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
                            }`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-medium"
                                >
                                    {item.title}
                                </motion.span>
                            )}
                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white dark:bg-neutral-900"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="border-t border-neutral-100 p-4 dark:border-neutral-900">
                {!isCollapsed ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
                            <UserInfo user={authUser} />
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sign out</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-800">
                            <UserInfo user={authUser} />
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                            <LogOut className="h-5 w-5" />
                        </Link>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
