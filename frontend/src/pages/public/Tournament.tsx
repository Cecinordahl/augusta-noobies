import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { Course, Highlight, Photo, Player, SidePrize, Tournament as TournamentDto } from "../../types";
import { PillNav } from "../../components/public/PillNav";
import { DarkPanel } from "../../components/public/DarkPanel";
import { Footer } from "../../components/public/Footer";

export function Tournament() {
  const { year } = useParams<{ year: string }>();
  const [tournament, setTournament] = useState<TournamentDto | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sidePrizes, setSidePrizes] = useState<SidePrize[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!year) return;
    setNotFound(false);
    apiGet<TournamentDto>(`/api/tournaments/${year}`)
      .then((t) => {
        setTournament(t);
        apiGet<SidePrize[]>(`/api/side-prizes?tournamentId=${t.id}`).then(setSidePrizes);
        apiGet<Photo[]>(`/api/photos?tournamentId=${t.id}`).then(setPhotos);
        apiGet<Highlight[]>(`/api/highlights?tournamentId=${t.id}`).then(setHighlights);
        if (t.courseId) apiGet<Course>(`/api/courses/${t.courseId}`).then(setCourse);
      })
      .catch(() => setNotFound(true));
    apiGet<Player[]>("/api/players").then(setPlayers);
  }, [year]);

  const registeredNames = tournament
    ? tournament.registeredPlayerIds
        .map((id) => players.find((p) => p.id === id)?.name ?? id)
        .sort()
    : [];

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <PillNav
          items={[
            { label: "Forside", to: "/" },
            { label: "Champions", to: "/wall-of-champions", dot: true },
          ]}
        />

        {notFound && (
          <p className="py-16 text-green-deep">Fant ingen turnering for {year}.</p>
        )}

        {tournament && (
          <>
            <div className="py-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                Turnering {tournament.year}
              </p>
              <h1 className="mt-2 font-serif text-5xl italic text-green-deep">
                {tournament.location}
              </h1>
              <div className="mt-4 flex flex-wrap gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-green-deep/60">Dato</p>
                  <p className="font-serif text-2xl italic text-green-deep">
                    {new Date(tournament.date).toLocaleDateString("nb-NO")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-green-deep/60">HCP%</p>
                  <p className="font-serif text-2xl italic text-green-deep">
                    {tournament.hcpPercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-green-deep/60">Status</p>
                  <p className="font-serif text-2xl italic text-green-deep capitalize">
                    {tournament.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 py-6 lg:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Påmeldte spillere
                </h2>
                <ul className="space-y-1 text-green-deep">
                  {registeredNames.map((name) => (
                    <li key={name} className="border-b border-green-deep/10 py-1">
                      {name}
                    </li>
                  ))}
                  {registeredNames.length === 0 && <li className="text-green-deep/60">Ingen påmeldte ennå.</li>}
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Sidepriser
                </h2>
                <ul className="space-y-3">
                  {sidePrizes.map((prize) => (
                    <li key={prize.id} className="border-b border-green-deep/10 pb-3">
                      <p className="font-serif text-xl italic text-green-deep">{prize.title}</p>
                      {prize.description && (
                        <p className="text-sm text-green-deep/70">{prize.description}</p>
                      )}
                      {prize.winnerPlayerId && (
                        <p className="text-sm text-green-deep">
                          Vinner: {players.find((p) => p.id === prize.winnerPlayerId)?.name ?? prize.winnerPlayerId}
                        </p>
                      )}
                    </li>
                  ))}
                  {sidePrizes.length === 0 && <li className="text-green-deep/60">Ingen sidepriser registrert.</li>}
                </ul>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="py-6">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Bilder
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <figure key={photo.id} className="overflow-hidden rounded-panel">
                      <img src={photo.url} alt={photo.caption ?? ""} className="h-40 w-full object-cover" />
                      {photo.caption && (
                        <figcaption className="p-2 text-xs text-green-deep/70">{photo.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="py-6">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-deep/60">
                  Historier &amp; sitater
                </h2>
                <div className="space-y-4">
                  {highlights.map((h) => (
                    <blockquote key={h.id} className="border-l-2 border-gold pl-4 text-green-deep">
                      <p className="font-serif text-xl italic">&ldquo;{h.text}&rdquo;</p>
                      {h.author && <p className="mt-1 text-sm text-green-deep/60">— {h.author}</p>}
                    </blockquote>
                  ))}
                </div>
              </div>
            )}

            {course?.localRules && (
              <DarkPanel className="my-10 p-8">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/60">
                  Lokale regler — {course.name}
                </h2>
                <p className="whitespace-pre-wrap text-sm text-cream/90">{course.localRules}</p>
              </DarkPanel>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
