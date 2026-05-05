import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:h-16 md:px-6 transition-all">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:block">
                {/* Breadcrumbs removed as per request */}
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button className="hidden md:inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search vault...</span>
                    <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                </button>
                <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </button>
                <ThemeToggle />
            </div>
        </header>
    );
}
