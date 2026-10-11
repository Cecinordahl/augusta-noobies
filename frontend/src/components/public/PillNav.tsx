import { Link } from "react-router-dom";

export interface PillNavItem {
  label: string;
  to: string;
  dot?: boolean;
}

interface PillNavProps {
  items: PillNavItem[];
  cta?: { label: string; to: string };
}

export function PillNav({ items, cta }: PillNavProps) {
  return (
    <nav className="flex items-center justify-between gap-4 py-6">
      <div className="flex flex-wrap items-center gap-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 rounded-full border border-green-deep/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-deep transition hover:border-green-deep"
          >
            {item.dot && <span className="h-2 w-2 rounded-full bg-green-deep" />}
            {item.label}
          </Link>
        ))}
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="rounded-full bg-green-deep px-5 py-2 text-xs font-semibold uppercase tracking-wide text-cream transition hover:bg-green-mid"
        >
          {cta.label}
        </Link>
      )}
    </nav>
  );
}
