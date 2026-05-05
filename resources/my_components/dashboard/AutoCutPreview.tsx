import { Plane, GraduationCap, Home } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const goals = [
  { name: "Voyage Istanbul", icon: Plane, saved: 6800, target: 12000, due: "Aug 2026" },
  { name: "Rentrée scolaire", icon: GraduationCap, saved: 2400, target: 4000, due: "Sep 2026" },
  { name: "Down payment", icon: Home, saved: 18500, target: 80000, due: "Dec 2027" },
];

export function AutoCutPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">AutoCut goals</h3>
          <p className="text-xs text-muted-foreground">Next deduction · May 28</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">Manage</button>
      </div>
      <ul className="mt-4 space-y-4">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <li key={g.name}>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <g.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{g.name}</p>
                    <span className="text-xs text-muted-foreground">{g.due}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {g.saved.toLocaleString()} / {g.target.toLocaleString()} MAD
                    </span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1.5 h-1.5" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
