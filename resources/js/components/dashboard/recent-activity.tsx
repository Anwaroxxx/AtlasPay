import { motion } from 'framer-motion';

interface ActivityItem {
    id: string;
    entity: string;
    action: string;
    time: string;
    amount?: string;
    status: 'completed' | 'pending' | 'failed';
    type: 'deposit' | 'withdrawal' | 'transfer';
}

const activities: ActivityItem[] = [
    { id: '1', entity: 'AtlasPay Vault', action: 'Direct Deposit', time: '12 mins ago', amount: '+$12,500.00', status: 'completed', type: 'deposit' },
    { id: '2', entity: 'Stripe Inc.', action: 'Merchant Payout', time: '2 hours ago', amount: '+$4,250.00', status: 'completed', type: 'deposit' },
    { id: '3', entity: 'AWB Bank', action: 'Wire Transfer', time: '5 hours ago', amount: '-$1,850.00', status: 'pending', type: 'transfer' },
    { id: '4', entity: 'AWS Web Services', action: 'Cloud Infrastructure', time: '1 day ago', amount: '-$340.00', status: 'completed', type: 'withdrawal' },
    { id: '5', entity: 'Binance Exchange', action: 'Crypto Purchase', time: '2 days ago', amount: '-$5,000.00', status: 'failed', type: 'withdrawal' },
];

export function RecentActivity() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm hover:border-brand-medium/30 transition-all hover:shadow-[0_0_25px_rgba(118,177,130,0.1)]"
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Recent Activity</h3>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline transition-colors">View all</button>
            </div>
            
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={activity.id}
                        className="group flex items-center justify-between py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                                activity.type === 'deposit' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30' :
                                activity.type === 'transfer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30' :
                                'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 group-hover:bg-rose-200 dark:group-hover:bg-rose-500/30'
                            }`}>
                                <span className="text-sm font-bold">
                                    {activity.entity.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{activity.entity}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.action} • {activity.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {activity.amount && (
                                <p className={`text-sm font-bold font-serif ${
                                    activity.amount.startsWith('+') ? 'text-[#76b182]' : 'text-neutral-900 dark:text-neutral-50'
                                }`}>
                                    {activity.amount}
                                </p>
                            )}
                            <p className={`text-[10px] uppercase tracking-wider font-semibold mt-0.5 ${
                                activity.status === 'completed' ? 'text-emerald-600 dark:text-emerald-500' :
                                activity.status === 'pending' ? 'text-amber-500 dark:text-amber-400' :
                                'text-rose-500 dark:text-rose-400'
                            }`}>
                                {activity.status}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
