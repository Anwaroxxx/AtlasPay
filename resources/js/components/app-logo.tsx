import { Zap } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-lg">
                <Zap className="size-5 fill-current" />
            </div>
            <div className="grid flex-1 text-left">
                <span className="font-display text-base font-bold leading-none tracking-tight uppercase">
                    Atlas<span className="text-primary">Pay</span>
                </span>
            </div>
        </div>
    );
}
