import { motion } from 'framer-motion';

const data = [30, 45, 35, 55, 48, 70, 65, 85, 75, 90, 80, 95];

export function OverviewChart() {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Overview</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Monthly revenue growth</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Current</span>
                    </div>
                </div>
            </div>
            
            <div className="relative h-[200px] w-full overflow-hidden">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((tick) => (
                        <line
                            key={tick}
                            x1="0"
                            y1={tick}
                            x2="100"
                            y2={tick}
                            stroke="currentColor"
                            className="text-neutral-100 dark:text-neutral-800"
                            strokeWidth="0.5"
                        />
                    ))}
                    
                    {/* The Chart Line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={`M ${data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(' L ')}`}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Area fill */}
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ delay: 1, duration: 1 }}
                        d={`M ${data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(' L ')} L 100,100 L 0,100 Z`}
                        fill="url(#gradient)"
                    />
                    
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Dots on peak points */}
                <div className="absolute inset-0 flex justify-between px-[2%]">
                    {data.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5 + (i * 0.05) }}
                            className="group relative h-full flex flex-col justify-end"
                            style={{ width: `${100 / data.length}%` }}
                        >
                            <div 
                                className="absolute left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ bottom: `${val}%` }}
                            />
                            <div className="h-full w-full bg-transparent hover:bg-neutral-500/5 transition-colors rounded-lg cursor-pointer" />
                        </motion.div>
                    ))}
                </div>
            </div>
            
            <div className="mt-4 flex justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Dec</span>
            </div>
        </div>
    );
}
