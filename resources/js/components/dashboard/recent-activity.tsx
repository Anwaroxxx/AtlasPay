import { motion } from 'framer-motion';

interface ActivityItem {
    id: string;
    user: string;
    action: string;
    time: string;
    amount?: string;
    status: 'completed' | 'pending' | 'failed';
}

const activities: ActivityItem[] = [
    { id: '1', user: 'Alex Rivera', action: 'Payment received', time: '2 mins ago', amount: '+$1,250.00', status: 'completed' },
    { id: '2', user: 'Sarah Chen', action: 'Internal transfer', time: '1 hour ago', amount: '-$450.00', status: 'completed' },
    { id: '3', user: 'James Wilson', action: 'New subscription', time: '3 hours ago', amount: '+$29.00', status: 'pending' },
    { id: '4', user: 'Tech Corp', action: 'Invoice paid', time: '5 hours ago', amount: '+$3,400.00', status: 'completed' },
];

export function RecentActivity() {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Recent Activity</h3>
                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View all</button>
            </div>
            
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={activity.id}
                        className="flex items-center justify-between py-2"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center dark:bg-neutral-800">
                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                    {activity.user.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{activity.user}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.action} • {activity.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {activity.amount && (
                                <p className={`text-sm font-semibold ${activity.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-50'}`}>
                                    {activity.amount}
                                </p>
                            )}
                            <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                {activity.status}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
