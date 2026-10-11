import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { Player, Result, Tournament } from "../../types";
import { PillNav } from "../../components/public/PillNav";
import { HcpLineChart } from "../../components/public/HcpLineChart";
import { Footer } from "../../components/public/Footer";

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [rows, setRows] = useState<Array<{ year: number; placement: number; hcpPercentage: number }>>([]);

  useEffect(() => {
    if (!id) return;
    apiGet<Player>(`/api/players/${id}`).then(setPlayer).catch(() => setPlayer(null));
    Promise.all([
      apiGet<Result[]>(`/api/results`),
      apiGet<Tournament[]>(`/api/tournaments`),
    ]).then(([results, tournaments]) => {
      const tournamentById = new Map(tournaments.map((t) => [t.id, t]));
      const playerRows = results
        .filter((r) => r.playerId === id)
        .map((r) => ({
          year: tournamentById.get(r.tournamentId)?.year ?? 0,
          placement: r.placement,
          hcpPercentage: r.hcpPercentage,
        }))
        .sort((a, b) => a.year - b.year);
      setRows(playerRows);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <PillNav items={[{ label: "Forside", to: "/" }, { label: "Champions", to: "/wall-of-champions", dot: true }]} />

        {player && (
          <div className="flex items-center gap-6 py-8">
            {player.photoUrl && (
              <img src={player.photoUrl} alt={player.name} className="h-24 w-24 rounded-full object-cover" />
            )}
            <div>
              <h1 className="font-serif text-5xl italic text-green-deep">{player.name}</h1>
              <p className="text-sm text-green-deep/60">Med siden {player.joinedYear}</p>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="py-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
              HCP-utvikling
            </h2>
            <HcpLineChart data={rows} />
          </div>
        )}

        <div className="py-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
            Historikk
          </h2>
          <table className="w-full text-left text-green-deep">
            <thead>
              <tr className="border-b border-green-deep/20 text-xs uppercase tracking-widest text-green-deep/60">
                <th className="py-2">År</th>
                <th className="py-2">Plassering</th>
                <th className="py-2">HCP%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className="border-b border-green-deep/10">
                  <td className="py-2">{row.year}</td>
                  <td className="py-2">{row.placement}</td>
                  <td className="py-2">{row.hcpPercentage}%</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-green-deep/60">
                    Ingen resultater registrert ennå.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
