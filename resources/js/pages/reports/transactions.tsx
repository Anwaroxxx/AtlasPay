import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Activity, CreditCard, Hash, ArrowRightLeft, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Transactions({ reportData }: any) {
    const { overview, user, accounts, transactions } = reportData;
    const account = accounts[0]; // Assuming one account for now based on the report

    const tableContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const tableRow = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <Head title="Transactions Report" />
            
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Transaction Report</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Detailed financial activity for your vault.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Status: </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {account?.status || 'Active'}
                        </span>
                    </div>
                </div>

                {/* Account Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                <DollarSign className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Current Balance</p>
                                <p className="text-2xl font-bold font-serif">{Number(account?.balance || 0).toLocaleString()} {account?.currency}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                <CreditCard className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Account Type</p>
                                <p className="text-xl font-bold capitalize">{account?.type}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
                        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                <Hash className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div className="w-full overflow-hidden">
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Account ID</p>
                                <p className="text-sm font-mono truncate">{account?.account_number}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Transactions Table */}
                <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                    <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800 flex items-center gap-3">
                        <ArrowRightLeft className="w-5 h-5 text-neutral-500" />
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Transaction History</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Transaction ID</th>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    <th scope="col" className="px-6 py-4">Type</th>
                                    <th scope="col" className="px-6 py-4">Method</th>
                                    <th scope="col" className="px-6 py-4">Amount</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <motion.tbody variants={tableContainer} initial="hidden" animate="show">
                                {transactions.data.length > 0 ? (
                                    transactions.data.map((tx: any) => (
                                        <motion.tr variants={tableRow} key={tx.id} className="border-b border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-neutral-900 dark:text-neutral-50">
                                                #{tx.id.toString().padStart(6, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(tx.created_at).toLocaleDateString()} <span className="text-xs text-neutral-500">{new Date(tx.created_at).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4 capitalize font-medium">
                                                {tx.type}
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                {tx.method}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-50">
                                                {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString()} {account?.currency}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    tx.status === 'completed' 
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : tx.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr variants={tableRow}>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                            No transactions found for this account.
                                        </td>
                                    </motion.tr>
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Transactions.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Transactions Report',
            href: '/reports/transactions',
        },
    ],
};
