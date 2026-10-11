import type { PropsWithChildren } from "react";

interface DarkPanelProps {
  className?: string;
}

export function DarkPanel({ className = "", children }: PropsWithChildren<DarkPanelProps>) {
  return (
    <div
      className={`rounded-panel bg-near-black text-cream ${className}`}
    >
      {children}
    </div>
  );
}
