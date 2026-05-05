import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Link } from '@inertiajs/react';
import { ArrowRight, BarChart3 } from "lucide-react";

const data = [
  { c: "Food", v: 1240 },
  { c: "Transport", v: 680 },
  { c: "Bills", v: 2100 },
  { c: "Shopping", v: 940 },
  { c: "Café", v: 510 },
  { c: "Other", v: 320 },
];

const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-destructive)', '#8b5cf6', '#ec4899'];

export function SpendingChart() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft hover:shadow-elevated transition-all group relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-tight">Spending <span className="text-primary italic">Analysis.</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Monthly Volume · MAD</p>
          </div>
        </div>
        <Link 
            href="/reports/transactions" 
            className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
        >
            Details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 min-h-[180px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} strokeOpacity={0.3} />
            <XAxis 
                dataKey="c" 
                stroke="var(--color-muted-foreground)" 
                fontSize={9} 
                fontWeight="900" 
                tickLine={false} 
                axisLine={false} 
                className="uppercase tracking-widest"
                dy={10}
            />
            <YAxis 
                stroke="var(--color-muted-foreground)" 
                fontSize={9} 
                fontWeight="900" 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
            />
            <Tooltip
              cursor={{ fill: "var(--color-primary)", opacity: 0.05 }}
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 24,
                fontSize: 12,
                fontWeight: '900',
                boxShadow: "var(--shadow-elevated)",
                padding: '16px'
              }}
              labelStyle={{ color: 'var(--color-foreground)', marginBottom: '4px' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Bar dataKey="v" radius={[12, 12, 4, 4]} maxBarSize={32} animationDuration={2000}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-8 border-t border-border/50 relative z-10">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Total Spending</p>
                <p className="text-3xl font-black tracking-tighter">5,790 <span className="text-[10px] font-normal opacity-40">MAD</span></p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-success/10 text-success flex items-center justify-center font-black text-xs">
                +14%
            </div>
        </div>
      </div>
    </div>
  );
}

