import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import './i18n';
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'AtlasPay';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<React.ComponentType>('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();