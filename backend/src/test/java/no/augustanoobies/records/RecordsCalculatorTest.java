package no.augustanoobies.records;

import no.augustanoobies.dto.Champion;
import no.augustanoobies.dto.LandingSummary;
import no.augustanoobies.dto.Player;
import no.augustanoobies.dto.RecordsSummary;
import no.augustanoobies.dto.Result;
import no.augustanoobies.dto.Tournament;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class RecordsCalculatorTest {

    private final Player alice = new Player("p1", "Alice", null, 2020);
    private final Player bob = new Player("p2", "Bob", null, 2020);

    private final Tournament t2022 = new Tournament("2022", 2022, "2022-06-01", "Oslo", null, 100, "completed", List.of());
    private final Tournament t2023 = new Tournament("2023", 2023, "2023-06-01", "Oslo", null, 100, "completed", List.of());
    private final Tournament t2024 = new Tournament("2024", 2024, "2024-06-01", "Oslo", null, 90, "completed", List.of());
    private final Tournament t2025 = new Tournament("2025", 2025, "2025-06-01", "Oslo", null, 90, "cancelled", List.of());
    private final Tournament t2026 = new Tournament("2026", 2026, "2026-06-01", "Oslo", null, 80, "planned", List.of("p1", "p2"));

    private final List<Result> results = List.of(
            new Result("r1", "2022", "p1", 110, 100, 3),
            new Result("r2", "2022", "p2", 90, 100, 1),
            new Result("r3", "2023", "p1", 100, 100, 1),
            new Result("r4", "2023", "p2", 95, 100, 4),
            new Result("r5", "2024", "p1", 85, 90, 1),
            new Result("r6", "2024", "p2", 98, 90, 3)
    );

    private final Map<String, Tournament> tournamentsById = Map.of(
            "2022", t2022, "2023", t2023, "2024", t2024, "2025", t2025, "2026", t2026
    );
    private final Map<String, Player> playersById = Map.of("p1", alice, "p2", bob);

    @Test
    void computesLowestScoreEver() {
        RecordsSummary summary = RecordsCalculator.computeRecordsSummary(results, tournamentsById, playersById);
        assertNotNull(summary.lowestScoreEver());
        assertEquals("p1", summary.lowestScoreEver().playerId());
        assertEquals(85, summary.lowestScoreEver().score());
        assertEquals(2024, summary.lowestScoreEver().year());
    }

    @Test
    void computesBiggestImprovementIgnoringNonImprovingPlayers() {
        RecordsSummary summary = RecordsCalculator.computeRecordsSummary(results, tournamentsById, playersById);
        assertNotNull(summary.biggestImprovement());
        assertEquals("p1", summary.biggestImprovement().playerId());
        assertEquals(15, summary.biggestImprovement().delta());
        assertEquals(2023, summary.biggestImprovement().fromYear());
        assertEquals(2024, summary.biggestImprovement().toYear());
    }

    @Test
    void computesMostPodiums() {
        RecordsSummary summary = RecordsCalculator.computeRecordsSummary(results, tournamentsById, playersById);
        assertNotNull(summary.mostPodiums());
        assertEquals("p1", summary.mostPodiums().playerId());
        assertEquals(3, summary.mostPodiums().count());
    }

    @Test
    void computesChampionsIncludingCancelledYears() {
        List<Champion> champions = RecordsCalculator.computeChampions(
                List.of(t2022, t2023, t2024, t2025, t2026), results, playersById
        );

        assertEquals(4, champions.size());
        assertEquals(2025, champions.get(0).year());
        assertEquals("cancelled", champions.get(0).status());
        assertNull(champions.get(0).player());

        assertEquals(2024, champions.get(1).year());
        assertEquals("completed", champions.get(1).status());
        assertEquals("p1", champions.get(1).player().id());
        assertEquals(85, champions.get(1).score());
    }

    @Test
    void computesLandingSummary() {
        LandingSummary summary = RecordsCalculator.computeLandingSummary(
                List.of(t2022, t2023, t2024, t2025, t2026), results, playersById, LocalDate.of(2026, 1, 1)
        );

        assertNotNull(summary.nextTournament());
        assertEquals("2026", summary.nextTournament().id());
        assertEquals(80.0, summary.currentHcpPercentage());
        assertEquals(2, summary.registeredPlayerCount());

        assertNotNull(summary.reigningChampion());
        assertEquals("p1", summary.reigningChampion().id());
        assertEquals(2024, summary.reigningChampion().year());
    }
}
