import { ZiggyRouteFn } from 'ziggy-js';

declare global {
    interface Window {
        Ziggy: {
            location: string;
            config: {
                url: string;
                port: number | null;
                defaults: Record<string, unknown>;
            };
            routes: Record<string, any>;
        };
        route: ZiggyRouteFn;
    }
}

export const route = ((...args: Parameters<ZiggyRouteFn>) => {
    if (typeof window !== 'undefined' && window.route) {
        return window.route(...args);
    }
    console.warn('Ziggy route helper not available');
    return args[0];
}) as ZiggyRouteFn;

export default route;