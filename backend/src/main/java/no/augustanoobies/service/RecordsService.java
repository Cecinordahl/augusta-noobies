package no.augustanoobies.service;

import no.augustanoobies.dto.Champion;
import no.augustanoobies.dto.LandingSummary;
import no.augustanoobies.dto.Player;
import no.augustanoobies.dto.RecordsSummary;
import no.augustanoobies.dto.Result;
import no.augustanoobies.dto.Tournament;
import no.augustanoobies.records.RecordsCalculator;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RecordsService {

    private final PlayerService playerService;
    private final TournamentService tournamentService;
    private final ResultService resultService;

    public RecordsService(PlayerService playerService, TournamentService tournamentService, ResultService resultService) {
        this.playerService = playerService;
        this.tournamentService = tournamentService;
        this.resultService = resultService;
    }

    public RecordsSummary getRecordsSummary() {
        List<Result> results = resultService.list(null);
        Map<String, Tournament> tournamentsById = indexById(tournamentService.list(), Tournament::id);
        Map<String, Player> playersById = indexById(playerService.list(), Player::id);
        return RecordsCalculator.computeRecordsSummary(results, tournamentsById, playersById);
    }

    public List<Champion> getChampions() {
        List<Tournament> tournaments = tournamentService.list();
        List<Result> results = resultService.list(null);
        Map<String, Player> playersById = indexById(playerService.list(), Player::id);
        return RecordsCalculator.computeChampions(tournaments, results, playersById);
    }

    public LandingSummary getLandingSummary() {
        List<Tournament> tournaments = tournamentService.list();
        List<Result> results = resultService.list(null);
        Map<String, Player> playersById = indexById(playerService.list(), Player::id);
        return RecordsCalculator.computeLandingSummary(tournaments, results, playersById, LocalDate.now());
    }

    private static <T> Map<String, T> indexById(List<T> items, Function<T, String> idFn) {
        return items.stream().collect(Collectors.toMap(idFn, Function.identity(), (a, b) -> a));
    }
}
