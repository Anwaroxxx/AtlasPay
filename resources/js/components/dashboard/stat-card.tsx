import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{value}</h3>
                </div>
                <div className="rounded-xl bg-neutral-100 p-2.5 dark:bg-neutral-800">
                    <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
                {trend && (
                    <span className={`text-xs font-semibold ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {trend.positive ? '+' : ''}{trend.value}
                    </span>
                )}
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>
            </div>
            
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-neutral-50/50 blur-2xl dark:bg-neutral-800/20" />
        </motion.div>
    );
}
