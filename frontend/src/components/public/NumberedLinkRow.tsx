import { Link } from "react-router-dom";

export interface NumberedLink {
  label: string;
  to: string;
}

interface NumberedLinkRowProps {
  items: NumberedLink[];
}

export function NumberedLinkRow({ items }: NumberedLinkRowProps) {
  return (
    <div>
      {items.map((item, index) => (
        <Link
          key={item.to}
          to={item.to}
          className="group flex items-center justify-between border-b border-green-deep/20 py-6 first:border-t"
        >
          <div className="flex items-baseline gap-6">
            <span className="text-xs font-semibold text-green-deep/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-serif text-4xl italic text-green-deep sm:text-5xl">
              {item.label}
            </span>
          </div>
          <span className="text-2xl text-green-deep transition group-hover:translate-x-1">
            {index === 0 ? "→" : "↘"}
          </span>
        </Link>
      ))}
    </div>
  );
}
