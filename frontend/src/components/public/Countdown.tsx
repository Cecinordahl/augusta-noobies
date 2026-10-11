import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
}

function getRemaining(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units: Array<[string, number]> = [
    ["Dager", remaining.days],
    ["Timer", remaining.hours],
    ["Min", remaining.minutes],
    ["Sek", remaining.seconds],
  ];

  return (
    <div className="flex gap-6">
      {units.map(([label, value]) => (
        <div key={label} className="text-center">
          <p className="font-serif text-4xl italic text-scoreboard-yellow sm:text-5xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/60">{label}</p>
        </div>
      ))}
    </div>
  );
}
