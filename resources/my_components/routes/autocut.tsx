import { createFileRoute } from "@tanstack/react-router";
import { Plane, GraduationCap, Home, Car, Heart, Plus, Lock, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/autocut")({
  component: AutoCutPage,
  head: () => ({ meta: [{ title: "AutoCut — AtlasPay" }] }),
});

const goals = [
  { name: "Voyage Istanbul", icon: Plane, saved: 6800, target: 12000, monthly: 650, due: "Aug 2026" },
  { name: "Rentrée scolaire", icon: GraduationCap, saved: 2400, target: 4000, monthly: 400, due: "Sep 2026" },
  { name: "Down payment", icon: Home, saved: 18500, target: 80000, monthly: 1500, due: "Dec 2027" },
  { name: "Voiture Dacia", icon: Car, saved: 14200, target: 80000, monthly: 2200, due: "Mar 2028" },
  { name: "Mariage", icon: Heart, saved: 9500, target: 60000, monthly: 1800, due: "Jun 2028" },
];

function AutoCutPage() {
  const total = goals.reduce((s, g) => s + g.saved, 0);
  const monthly = goals.reduce((s, g) => s + g.monthly, 0);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Savings vault</p>
          <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">AutoCut goals</h1>
          <p className="mt-1 text-sm text-muted-foreground">Locked savings, deducted automatically every month.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New goal</Button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <p className="text-xs uppercase tracking-wider text-primary-foreground/70">Vault total</p>
          <p className="mt-2 font-display text-3xl font-semibold">{total.toLocaleString()} MAD</p>
          <p className="mt-1 text-xs text-primary-foreground/80">Across {goals.length} goals · locked</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly cut</p>
          <p className="mt-2 font-display text-3xl font-semibold">{monthly.toLocaleString()} MAD</p>
          <p className="mt-1 text-xs text-muted-foreground">Next: May 28</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Avg. progress</p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {Math.round((goals.reduce((s, g) => s + g.saved / g.target, 0) / goals.length) * 100)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">On track</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div key={g.name} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[image:var(--gradient-mint)] text-deep">
                  <g.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-base font-semibold">{g.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" /> Target {g.due}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-end justify-between">
                  <p className="font-display text-2xl font-semibold">{g.saved.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">/ {g.target.toLocaleString()} MAD</p>
                </div>
                <Progress value={pct} className="mt-2 h-2" />
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>{pct}% complete</span>
                  <span>{g.monthly.toLocaleString()} MAD / month</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">Boost</Button>
                <Button size="sm" variant="ghost" className="flex-1 text-destructive hover:text-destructive">Emergency unlock</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
