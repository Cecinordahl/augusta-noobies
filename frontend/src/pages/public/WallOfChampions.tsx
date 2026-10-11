import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { Champion, RecordEntry } from "../../types";
import { PillNav } from "../../components/public/PillNav";
import { DarkPanel } from "../../components/public/DarkPanel";
import { ScoreboardStrip } from "../../components/public/ScoreboardStrip";
import { Footer } from "../../components/public/Footer";

export function WallOfChampions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [records, setRecords] = useState<RecordEntry | null>(null);

  useEffect(() => {
    apiGet<Champion[]>("/api/champions").then(setChampions).catch(() => setChampions([]));
    apiGet<RecordEntry>("/api/records").then(setRecords).catch(() => setRecords(null));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <PillNav items={[{ label: "Forside", to: "/" }]} />

        <h1 className="py-6 font-serif text-5xl italic text-green-deep">Wall of Champions</h1>

        <DarkPanel className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {champions.map((c) => (
            <div key={c.year} className="rounded-panel bg-cream/5 p-5">
              <p className="text-xs uppercase tracking-widest text-cream/50">{c.year}</p>
              {c.status === "completed" && c.player ? (
                <>
                  <p className="mt-2 font-serif text-2xl italic text-scoreboard-yellow">
                    {c.player.name}
                  </p>
                  {c.player.photoUrl && (
                    <img
                      src={c.player.photoUrl}
                      alt={c.player.name}
                      className="mt-3 h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  {c.score != null && <p className="mt-2 text-sm text-cream/70">Score: {c.score}</p>}
                </>
              ) : (
                <p className="mt-2 font-serif text-xl italic text-cream/50">
                  Ingen turnering — avlyst
                </p>
              )}
              {c.status === "completed" && (
                <Link
                  to={`/tournament/${c.year}`}
                  className="mt-3 inline-block text-xs uppercase tracking-widest text-cream/60 underline"
                >
                  Se turneringen
                </Link>
              )}
            </div>
          ))}
          {champions.length === 0 && <p className="text-cream/60">Ingen resultater registrert ennå.</p>}
        </DarkPanel>

        {records && (
          <section className="py-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
              Rekorder
            </p>
            <ScoreboardStrip
              items={[
                {
                  label: "Laveste runde noensinne",
                  value: records.lowestScoreEver ? String(records.lowestScoreEver.score) : "—",
                  sub: records.lowestScoreEver
                    ? `${records.lowestScoreEver.playerName}, ${records.lowestScoreEver.year}`
                    : undefined,
                },
                {
                  label: "Størst fremgang på ett år",
                  value: records.biggestImprovement ? `-${records.biggestImprovement.delta}` : "—",
                  sub: records.biggestImprovement
                    ? `${records.biggestImprovement.playerName}, ${records.biggestImprovement.fromYear}→${records.biggestImprovement.toYear}`
                    : undefined,
                },
                {
                  label: "Flest pallplasser",
                  value: records.mostPodiums ? String(records.mostPodiums.count) : "—",
                  sub: records.mostPodiums?.playerName,
                },
              ]}
            />
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
