import { ShoppingBag, ArrowDownLeft, ArrowUpRight, History, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from '@inertiajs/react';

interface Transaction {
  id: number;
  type: string;
  method: string;
  amount: number;
  created_at: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft hover:shadow-elevated transition-all group relative overflow-hidden">
      <div className="absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-tight">Transaction <span className="text-primary italic">History.</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last few activities</p>
          </div>
        </div>
        <Link 
            href="/reports/transactions" 
            className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
        >
            View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ul className="space-y-2 relative z-10">
        {transactions.map((t) => {
          const isDeposit = t.type === 'deposit';
          const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight;
          return (
            <li key={t.id} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/30 transition-all group/item">
              <div className={cn(
                "grid h-12 w-12 place-items-center rounded-2xl transition-transform group-hover/item:scale-110", 
                isDeposit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black uppercase tracking-tight text-foreground">{t.method.replace('_', ' ')}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  {new Date(t.created_at).toLocaleDateString()} · {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-black tracking-tighter", isDeposit ? "text-success" : "text-foreground")}>
                  {isDeposit ? "+" : "-"}{t.amount.toLocaleString()} <span className="text-[10px] font-normal opacity-60">MAD</span>
                </p>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0 border-border/50 bg-muted/20">
                    {t.status}
                </Badge>
              </div>
            </li>
          );
        })}
        {transactions.length === 0 && (
          <li className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">No recent transactions.</li>
        )}
      </ul>

      <Link href="/reports/transactions" className="mt-6 w-full h-14 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/20 transition-all">
        View Full History
      </Link>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", className)}>
            {children}
        </span>
    );
}

