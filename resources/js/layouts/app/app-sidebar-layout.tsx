import { CustomSidebar } from '@/components/custom-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-white dark:bg-neutral-950">
                <CustomSidebar />
                <main className="flex flex-1 flex-col overflow-hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}


