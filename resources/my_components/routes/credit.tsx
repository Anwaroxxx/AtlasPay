import { createFileRoute } from "@tanstack/react-router";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Check, TrendingUp, AlertTriangle, CreditCard } from "lucide-react";

export const Route = createFileRoute("/credit")({
  component: CreditPage,
  head: () => ({ meta: [{ title: "Credit Score — AtlasPay" }] }),
});

const score = 742;
const data = [{ name: "score", value: score, fill: "var(--color-primary)" }];

const events = [
  { t: "On-time loan repayment", d: "Apr 28 · +8 pts", icon: Check, tone: "success" },
  { t: "Average balance rose 12%", d: "Apr 15 · +6 pts", icon: TrendingUp, tone: "success" },
  { t: "Late Inwi bill", d: "Mar 22 · -4 pts", icon: AlertTriangle, tone: "warning" },
  { t: "Credit card fully repaid", d: "Mar 02 · +12 pts", icon: CreditCard, tone: "success" },
];

function CreditPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reputation</p>
        <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Credit & behaviour</h1>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="relative h-64 w-full">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 850]} tick={false} />
                <RadialBar background={{ fill: "var(--color-muted)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-5xl font-semibold">{score}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Excellent · /850</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { l: "On-time", v: "98%" },
              { l: "Debt ratio", v: "14%" },
              { l: "History", v: "3y" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-secondary p-2.5">
                <p className="font-display text-base font-semibold">{s.v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-base font-semibold">Recent events</h3>
            <ul className="mt-3 divide-y divide-border">
              {events.map((e) => (
                <li key={e.t} className="flex items-center gap-3 py-3">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${
                      e.tone === "success" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                    }`}
                  >
                    <e.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{e.t}</p>
                    <p className="text-xs text-muted-foreground">{e.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">You owe the bank</p>
              <p className="mt-2 font-display text-2xl font-semibold">3,200 MAD</p>
              <p className="mt-1 text-xs text-muted-foreground">Credit card · due May 25</p>
            </div>
            <div className="rounded-2xl bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/70">Bank owes you</p>
              <p className="mt-2 font-display text-2xl font-semibold">418 MAD</p>
              <p className="mt-1 text-xs text-primary-foreground/80">Cashback + interest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
