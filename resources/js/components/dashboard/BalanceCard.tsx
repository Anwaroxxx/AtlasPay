import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, QrCode, Sparkles, Wallet, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from '@inertiajs/react';

interface BalanceCardProps {
  balance: number;
  currency: string;
  accountNumber?: string;
}

export function BalanceCard({ balance, currency, accountNumber = "MA53 ATLS 0009 8821 4477" }: BalanceCardProps) {
  const [hidden, setHidden] = useState(false);
  
  const actions = [
    { label: "Transfer", icon: Wallet, href: "/transfer" },
    { label: "History", icon: ArrowDownLeft, href: "/reports/transactions" },
    { label: "QR Pay", icon: QrCode, href: "/qr" },
    { label: "Smart AI", icon: BrainCircuit, href: "/anwar" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-8 text-primary-foreground shadow-elevated group">
      <div className="absolute inset-0 moroccan-pattern opacity-[0.05] pointer-events-none" />
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl group-hover:scale-110 transition-transform duration-700" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground/60">Account Number</p>
          <p className="font-mono text-sm tracking-widest opacity-90">{accountNumber}</p>
        </div>
        <button
          onClick={() => setHidden((h) => !h)}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/10 text-primary-foreground/90 hover:bg-white/20 transition-all active:scale-95"
          aria-label="Toggle balance visibility"
        >
          {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative mt-8 mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground/60 mb-1">Available Balance</p>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-5xl md:text-7xl font-black tracking-tighter">
            {hidden ? "••••••" : balance.toLocaleString()}
          </span>
          <span className="text-xl font-black opacity-60 uppercase tracking-widest">{currency}</span>
        </div>
      </div>

      <div className="relative grid grid-cols-4 gap-4">
        {actions.map((a) => (
          <Link key={a.label} href={a.href} className="flex-1">
            <Button
              variant="ghost"
              className="w-full flex h-auto flex-col items-center gap-3 rounded-[1.5rem] bg-white/10 py-6 text-primary-foreground hover:bg-white/20 hover:scale-[1.02] transition-all border border-white/5 shadow-inner"
            >
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{a.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

