package no.augustanoobies.dto;

import java.util.List;

public record Tournament(
        String id,
        int year,
        String date,
        String location,
        String courseId,
        double hcpPercentage,
        String status,
        List<String> registeredPlayerIds
) {
}
