import { CustomSidebar } from '@/components/custom-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { props, url } = usePage();
    const sidebarOpen = (props as any).sidebarOpen ?? true;

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div className="flex min-h-screen w-full bg-white dark:bg-neutral-950">
                <CustomSidebar />
                <main className="flex flex-1 flex-col overflow-hidden">
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


