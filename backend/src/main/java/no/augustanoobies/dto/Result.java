package no.augustanoobies.dto;

public record Result(String id, String tournamentId, String playerId, int score, double hcpPercentage, int placement) {
}
