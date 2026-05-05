import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, Search } from "lucide-react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AtlasPay — Modern Moroccan Banking" },
      { name: "description", content: "AtlasPay: QR payments, AutoCut savings, AI Financial Twin and Daret groups for Morocco." },
      { name: "theme-color", content: "#36694b" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <div className="hidden md:block">
            <AppSidebar />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:h-16 md:px-6">
              <div className="hidden md:block">
                <SidebarTrigger />
              </div>
              <div className="md:hidden flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <span className="font-display text-xs font-bold">A</span>
                </div>
                <span className="font-display text-base font-semibold">AtlasPay</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <button className="hidden md:inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground">
                  <Search className="h-3.5 w-3.5" />
                  <span>Search transactions</span>
                  <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                </button>
                <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </button>
                <ThemeToggle />
                <div className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground">
                  YA
                </div>
              </div>
            </header>
            <main className="flex-1 pb-24 md:pb-0">
              <Outlet />
            </main>
            <BottomNav />
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
