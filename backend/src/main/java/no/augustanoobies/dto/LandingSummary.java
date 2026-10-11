package no.augustanoobies.dto;

public record LandingSummary(
        Tournament nextTournament,
        Double currentHcpPercentage,
        ReigningChampion reigningChampion,
        int registeredPlayerCount
) {
}
