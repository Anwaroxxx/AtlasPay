import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const bankingData = [
  { name: 'Jan', cashIn: 45000, cashOut: 32000 },
  { name: 'Feb', cashIn: 52000, cashOut: 41000 },
  { name: 'Mar', cashIn: 48000, cashOut: 39000 },
  { name: 'Apr', cashIn: 61000, cashOut: 45000 },
  { name: 'May', cashIn: 59000, cashOut: 52000 },
  { name: 'Jun', cashIn: 68000, cashOut: 48000 },
  { name: 'Jul', cashIn: 72000, cashOut: 55000 },
  { name: 'Aug', cashIn: 69000, cashOut: 60000 },
  { name: 'Sep', cashIn: 85000, cashOut: 62000 },
  { name: 'Oct', cashIn: 81000, cashOut: 58000 },
  { name: 'Nov', cashIn: 92000, cashOut: 65000 },
  { name: 'Dec', cashIn: 105000, cashOut: 75000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize text-neutral-500 dark:text-neutral-400">
                {entry.name.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="font-bold text-neutral-900 dark:text-neutral-50">
                ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewChart() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm hover:border-brand-medium/30 transition-all hover:shadow-[0_0_25px_rgba(118,177,130,0.1)]"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Cash Flow</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Monthly deposits vs withdrawals</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-[#76b182]" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Cash In</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Cash Out</span>
                    </div>
                </div>
            </div>
            
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={bankingData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCashIn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#76b182" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#76b182" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCashOut" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#888888" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#888888" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-800/50" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12 }}
                            className="text-neutral-400 dark:text-neutral-500"
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12 }}
                            className="text-neutral-400 dark:text-neutral-500"
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#76b182', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="cashOut" 
                            stroke="#888888" 
                            fillOpacity={1} 
                            fill="url(#colorCashOut)" 
                            strokeWidth={2}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="cashIn" 
                            stroke="#76b182" 
                            fillOpacity={1} 
                            fill="url(#colorCashIn)" 
                            strokeWidth={3}
                            activeDot={{ r: 6, fill: '#76b182', strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
