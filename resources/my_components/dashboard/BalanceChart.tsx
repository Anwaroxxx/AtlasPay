import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { d: "Mon", v: 38200 },
  { d: "Tue", v: 41100 },
  { d: "Wed", v: 39800 },
  { d: "Thu", v: 44250 },
  { d: "Fri", v: 43900 },
  { d: "Sat", v: 46100 },
  { d: "Sun", v: 47820 },
];

export function BalanceChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Balance evolution</h3>
          <p className="text-xs text-muted-foreground">Last 7 days · MAD</p>
        </div>
        <div className="flex gap-1 rounded-full border border-border p-0.5 text-xs">
          {["7D", "1M", "3M", "1Y"].map((p, i) => (
            <button
              key={p}
              className={
                i === 0
                  ? "rounded-full bg-primary px-3 py-1 text-primary-foreground"
                  : "rounded-full px-3 py-1 text-muted-foreground hover:text-foreground"
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--color-muted-foreground)" }}
            />
            <Area type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#bal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
