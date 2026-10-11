package no.augustanoobies.dto;

import java.util.List;

public record TournamentInput(
        int year,
        String date,
        String location,
        String courseId,
        double hcpPercentage,
        String status,
        List<String> registeredPlayerIds
) {
}
