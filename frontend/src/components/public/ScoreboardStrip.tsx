import { DarkPanel } from "./DarkPanel";

export interface ScoreboardItem {
  label: string;
  value: string;
  sub?: string;
}

interface ScoreboardStripProps {
  items: ScoreboardItem[];
}

export function ScoreboardStrip({ items }: ScoreboardStripProps) {
  return (
    <DarkPanel className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-3 sm:p-10">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">
            {item.label}
          </p>
          <p className="mt-2 font-serif text-3xl italic text-scoreboard-yellow sm:text-4xl">
            {item.value}
          </p>
          {item.sub && <p className="mt-1 text-sm text-cream/70">{item.sub}</p>}
        </div>
      ))}
    </DarkPanel>
  );
}
