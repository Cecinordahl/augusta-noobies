package no.augustanoobies.dto;

public record ResultInput(String tournamentId, String playerId, int score, double hcpPercentage, int placement) {
}
