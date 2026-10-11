import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { LandingSummary, RecordEntry } from "../../types";
import { PillNav } from "../../components/public/PillNav";
import { DarkPanel } from "../../components/public/DarkPanel";
import { Countdown } from "../../components/public/Countdown";
import { NumberedLinkRow } from "../../components/public/NumberedLinkRow";
import { ScoreboardStrip } from "../../components/public/ScoreboardStrip";
import { Footer } from "../../components/public/Footer";

export function Landing() {
  const [summary, setSummary] = useState<LandingSummary | null>(null);
  const [records, setRecords] = useState<RecordEntry | null>(null);

  useEffect(() => {
    apiGet<LandingSummary>("/api/landing-summary").then(setSummary).catch(() => setSummary(null));
    apiGet<RecordEntry>("/api/records").then(setRecords).catch(() => setRecords(null));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <PillNav
          items={[
            { label: "Turnering", to: summary?.nextTournament ? `/tournament/${summary.nextTournament.year}` : "/" },
            { label: "Champions", to: "/wall-of-champions", dot: true },
            { label: "Personvern", to: "/personvern", dot: true },
          ]}
        />

        <div className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-serif text-6xl italic text-green-deep sm:text-7xl">
              Augusta
              <br />
              Noobies
            </h1>
            <p className="mt-6 max-w-md text-sm text-green-deep/80">
              Vår private hyllest til The Masters. Ni til tolv venner, ett green jacket, og en
              håndicap-prosent som synker år for år.
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  HCP i år
                </p>
                <p className="mt-1 font-serif text-3xl italic text-green-deep">
                  {summary?.currentHcpPercentage != null ? `${summary.currentHcpPercentage}%` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Regjerende mester
                </p>
                <p className="mt-1 font-serif text-3xl italic text-green-deep">
                  {summary?.reigningChampion?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Påmeldte
                </p>
                <p className="mt-1 font-serif text-3xl italic text-green-deep">
                  {summary?.registeredPlayerCount ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <DarkPanel className="flex min-h-[360px] flex-col justify-between p-8">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl italic">AN</span>
              {summary?.nextTournament && (
                <Link
                  to={`/tournament/${summary.nextTournament.year}`}
                  className="rounded-full bg-scoreboard-yellow px-4 py-2 text-xs font-semibold uppercase tracking-wide text-near-black"
                >
                  Se turneringen
                </Link>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-cream/60">
                {summary?.nextTournament
                  ? `Nedtelling til ${summary.nextTournament.location}`
                  : "Ingen kommende turnering satt opp ennå"}
              </p>
              {summary?.nextTournament && (
                <div className="mt-4">
                  <Countdown targetDate={summary.nextTournament.date} />
                </div>
              )}
            </div>
          </DarkPanel>
        </div>

        <section className="py-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
            Utforsk
          </p>
          <NumberedLinkRow
            items={[
              { label: "Wall of Champions", to: "/wall-of-champions" },
              {
                label: "Årets turnering",
                to: summary?.nextTournament ? `/tournament/${summary.nextTournament.year}` : "/wall-of-champions",
              },
              { label: "Personvern", to: "/personvern" },
            ]}
          />
        </section>

        {records && (
          <section className="pb-16">
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
                  label: "Størst fremgang",
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
