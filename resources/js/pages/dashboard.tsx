import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { 
    TrendingUp, 
    Users, 
    CreditCard, 
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Dashboard" />
            
            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show" 
                className="flex flex-1 flex-col gap-6 p-4 md:p-8"
            >
                {/* Header Section */}
                <motion.div variants={item} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard Overview</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Welcome back to your workspace.</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-900">
                        <Plus className="h-4 w-4" />
                        <span>Action</span>
                    </button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
                    <StatCard 
                        title="Revenue" 
                        value="$45,231" 
                        description="Monthly"
                        icon={TrendingUp}
                        trend={{ value: '20%', positive: true }}
                    />
                    <StatCard 
                        title="Users" 
                        value="2,350" 
                        description="Weekly"
                        icon={Users}
                        trend={{ value: '18%', positive: true }}
                    />
                    <StatCard 
                        title="Sales" 
                        value="12,234" 
                        description="Daily"
                        icon={CreditCard}
                        trend={{ value: '19%', positive: true }}
                    />
                </motion.div>

                <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
                    <OverviewChart />
                    <RecentActivity />
                </motion.div>
            </motion.div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ],
};


