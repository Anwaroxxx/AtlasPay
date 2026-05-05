import { Link } from '@inertiajs/react';
import { Plane, GraduationCap, Home, Target, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const goals = [
  { name: "Voyage Istanbul", icon: Plane, saved: 6800, target: 12000, due: "Aug 2026" },
  { name: "Rentrée scolaire", icon: GraduationCap, saved: 2400, target: 4000, due: "Sep 2026" },
  { name: "Real Estate Deposit", icon: Home, saved: 18500, target: 80000, due: "Dec 2027" },
];

export function AutoCutPreview() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft hover:shadow-elevated transition-all group relative overflow-hidden">
      <div className="absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-tight">Savings <span className="text-primary italic">Goals.</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Next goal check · May 28</p>
          </div>
        </div>
        <Link 
            href="/savings" 
            className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
        >
            Explore <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ul className="space-y-3 relative z-10">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <li key={g.name} className="group/item">
              <div className="flex items-center gap-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/30 text-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                  <g.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="truncate text-sm font-black uppercase tracking-tight">{g.name}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{g.due}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
                    <span>
                      {g.saved.toLocaleString()} / {g.target.toLocaleString()} <span className="text-[8px] opacity-60">MAD</span>
                    </span>
                    <span className="text-primary">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5 bg-muted/30" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      <Link href="/savings" className="mt-4 w-full h-14 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/20 transition-all">
        View All Goals
      </Link>
    </div>
  );
}

