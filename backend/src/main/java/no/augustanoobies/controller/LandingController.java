package no.augustanoobies.controller;

import no.augustanoobies.dto.LandingSummary;
import no.augustanoobies.service.RecordsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LandingController {

    private final RecordsService recordsService;

    public LandingController(RecordsService recordsService) {
        this.recordsService = recordsService;
    }

    @GetMapping("/api/landing-summary")
    public LandingSummary landingSummary() {
        return recordsService.getLandingSummary();
    }
}
