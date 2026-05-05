import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Download, Coffee, ShoppingBag, Zap, ArrowDownLeft, Car, Utensils, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
  head: () => ({ meta: [{ title: "Transactions — AtlasPay" }] }),
});

const ICONS = { Café: Coffee, Shopping: ShoppingBag, Bills: Zap, Income: ArrowDownLeft, Transport: Car, Food: Utensils, Travel: Plane } as const;
type Cat = keyof typeof ICONS;

const ALL = [
  { name: "Café Atlas", cat: "Café" as Cat, amount: -42, date: "May 5 · 09:14", status: "Done" },
  { name: "Marjane Rabat", cat: "Shopping" as Cat, amount: -348, date: "May 5 · 08:02", status: "Done" },
  { name: "Salaire — TechCorp", cat: "Income" as Cat, amount: 12500, date: "May 4", status: "Done" },
  { name: "Lydec", cat: "Bills" as Cat, amount: -284, date: "May 3", status: "Done" },
  { name: "InDrive", cat: "Transport" as Cat, amount: -55, date: "May 2", status: "Done" },
  { name: "Snack Souissi", cat: "Food" as Cat, amount: -68, date: "May 2", status: "Done" },
  { name: "Royal Air Maroc", cat: "Travel" as Cat, amount: -2480, date: "Apr 29", status: "Done" },
  { name: "From Yassine", cat: "Income" as Cat, amount: 150, date: "Apr 28", status: "Done" },
  { name: "Inwi recharge", cat: "Bills" as Cat, amount: -100, date: "Apr 27", status: "Pending" },
  { name: "BIM Maarif", cat: "Shopping" as Cat, amount: -195, date: "Apr 26", status: "Done" },
];

function TransactionsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "in" | "out">("all");
  const list = useMemo(
    () =>
      ALL.filter((t) => {
        if (type === "in" && t.amount < 0) return false;
        if (type === "out" && t.amount > 0) return false;
        if (q && !t.name.toLowerCase().includes(q.toLowerCase()) && !t.cat.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, type]
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Activity</p>
          <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Transactions</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search merchant or category" className="pl-9" />
        </div>
        <div className="flex rounded-full border border-border p-0.5 text-xs">
          {(["all", "in", "out"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full px-3 py-1.5 capitalize",
                type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "all" ? "All" : t === "in" ? "Money in" : "Money out"}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-3.5 w-3.5" /> More filters
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <ul className="divide-y divide-border">
          {list.map((t, i) => {
            const Icon = ICONS[t.cat];
            return (
              <li key={i} className="flex items-center gap-3 p-4 hover:bg-muted/40">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.cat} · {t.date}
                  </p>
                </div>
                <span className="hidden sm:inline rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {t.status}
                </span>
                <span className={cn("text-sm font-semibold tabular-nums", t.amount > 0 ? "text-success" : "text-foreground")}>
                  {t.amount > 0 ? "+" : ""}
                  {t.amount.toLocaleString()} MAD
                </span>
              </li>
            );
          })}
          {list.length === 0 && (
            <li className="p-10 text-center text-sm text-muted-foreground">No transactions match your filters.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
