package no.augustanoobies.records;

import no.augustanoobies.dto.BiggestImprovement;
import no.augustanoobies.dto.Champion;
import no.augustanoobies.dto.ChampionPlayer;
import no.augustanoobies.dto.LandingSummary;
import no.augustanoobies.dto.LowestScoreEver;
import no.augustanoobies.dto.MostPodiums;
import no.augustanoobies.dto.Player;
import no.augustanoobies.dto.RecordsSummary;
import no.augustanoobies.dto.ReigningChampion;
import no.augustanoobies.dto.Result;
import no.augustanoobies.dto.Tournament;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Pure computation over already-fetched Firestore data. Kept free of any Firestore/Spring
 * dependency so it can be unit tested with plain in-memory fixtures.
 */
public final class RecordsCalculator {

    private RecordsCalculator() {
    }

    public static RecordsSummary computeRecordsSummary(
            List<Result> results, Map<String, Tournament> tournamentsById, Map<String, Player> playersById
    ) {
        return new RecordsSummary(
                computeLowestScoreEver(results, tournamentsById, playersById),
                computeBiggestImprovement(results, tournamentsById, playersById),
                computeMostPodiums(results, playersById)
        );
    }

    static LowestScoreEver computeLowestScoreEver(
            List<Result> results, Map<String, Tournament> tournamentsById, Map<String, Player> playersById
    ) {
        return results.stream()
                .filter(r -> tournamentsById.containsKey(r.tournamentId()) && playersById.containsKey(r.playerId()))
                .min(Comparator.comparingInt(Result::score))
                .map(r -> new LowestScoreEver(
                        r.playerId(),
                        playersById.get(r.playerId()).name(),
                        r.score(),
                        tournamentsById.get(r.tournamentId()).year()
                ))
                .orElse(null);
    }

    static BiggestImprovement computeBiggestImprovement(
            List<Result> results, Map<String, Tournament> tournamentsById, Map<String, Player> playersById
    ) {
        Map<String, List<Result>> byPlayer = results.stream()
                .filter(r -> tournamentsById.containsKey(r.tournamentId()))
                .collect(Collectors.groupingBy(Result::playerId));

        BiggestImprovement best = null;
        for (var entry : byPlayer.entrySet()) {
            String playerId = entry.getKey();
            Player player = playersById.get(playerId);
            if (player == null) {
                continue;
            }
            List<Result> sorted = entry.getValue().stream()
                    .sorted(Comparator.comparingInt(r -> tournamentsById.get(r.tournamentId()).year()))
                    .toList();
            for (int i = 1; i < sorted.size(); i++) {
                Result previous = sorted.get(i - 1);
                Result current = sorted.get(i);
                int delta = previous.score() - current.score();
                if (delta > 0 && (best == null || delta > best.delta())) {
                    best = new BiggestImprovement(
                            playerId,
                            player.name(),
                            delta,
                            tournamentsById.get(previous.tournamentId()).year(),
                            tournamentsById.get(current.tournamentId()).year()
                    );
                }
            }
        }
        return best;
    }

    static MostPodiums computeMostPodiums(List<Result> results, Map<String, Player> playersById) {
        Map<String, Long> podiumCounts = results.stream()
                .filter(r -> r.placement() <= 3 && playersById.containsKey(r.playerId()))
                .collect(Collectors.groupingBy(Result::playerId, Collectors.counting()));

        return podiumCounts.entrySet().stream()
                .max(Map.Entry.<String, Long>comparingByValue().thenComparing(e -> e.getKey(), Comparator.reverseOrder()))
                .map(e -> new MostPodiums(e.getKey(), playersById.get(e.getKey()).name(), e.getValue().intValue()))
                .orElse(null);
    }

    public static List<Champion> computeChampions(
            List<Tournament> tournaments, List<Result> results, Map<String, Player> playersById
    ) {
        List<Champion> champions = new ArrayList<>();
        for (Tournament tournament : tournaments) {
            if (!"completed".equals(tournament.status()) && !"cancelled".equals(tournament.status())) {
                continue;
            }
            if ("cancelled".equals(tournament.status())) {
                champions.add(new Champion(tournament.year(), "cancelled", null, null));
                continue;
            }
            Optional<Result> winner = results.stream()
                    .filter(r -> r.tournamentId().equals(tournament.id()) && r.placement() == 1)
                    .findFirst();
            if (winner.isEmpty()) {
                champions.add(new Champion(tournament.year(), "completed", null, null));
                continue;
            }
            Player player = playersById.get(winner.get().playerId());
            ChampionPlayer championPlayer = player == null
                    ? null
                    : new ChampionPlayer(player.id(), player.name(), player.photoUrl());
            champions.add(new Champion(tournament.year(), "completed", championPlayer, winner.get().score()));
        }
        champions.sort(Comparator.comparingInt(Champion::year).reversed());
        return champions;
    }

    public static LandingSummary computeLandingSummary(
            List<Tournament> tournaments, List<Result> results, Map<String, Player> playersById, LocalDate today
    ) {
        List<Tournament> planned = tournaments.stream()
                .filter(t -> "planned".equals(t.status()))
                .sorted(Comparator.comparing(t -> parseDate(t.date())))
                .toList();

        Tournament next = planned.stream()
                .filter(t -> !parseDate(t.date()).isBefore(today))
                .findFirst()
                .or(() -> planned.stream().findFirst())
                .orElse(null);

        Double currentHcp = next == null ? null : next.hcpPercentage();
        int registeredCount = next == null ? 0 : next.registeredPlayerIds().size();

        Tournament latestCompleted = tournaments.stream()
                .filter(t -> "completed".equals(t.status()))
                .max(Comparator.comparingInt(Tournament::year))
                .orElse(null);

        ReigningChampion reigningChampion = null;
        if (latestCompleted != null) {
            Optional<Result> winner = results.stream()
                    .filter(r -> r.tournamentId().equals(latestCompleted.id()) && r.placement() == 1)
                    .findFirst();
            if (winner.isPresent() && playersById.containsKey(winner.get().playerId())) {
                Player player = playersById.get(winner.get().playerId());
                reigningChampion = new ReigningChampion(player.id(), player.name(), player.photoUrl(), latestCompleted.year());
            }
        }

        return new LandingSummary(next, currentHcp, reigningChampion, registeredCount);
    }

    private static LocalDate parseDate(String date) {
        return LocalDate.parse(date.length() > 10 ? date.substring(0, 10) : date);
    }
}
