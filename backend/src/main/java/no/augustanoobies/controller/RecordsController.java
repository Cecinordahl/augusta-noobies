package no.augustanoobies.controller;

import no.augustanoobies.dto.Champion;
import no.augustanoobies.dto.RecordsSummary;
import no.augustanoobies.service.RecordsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RecordsController {

    private final RecordsService recordsService;

    public RecordsController(RecordsService recordsService) {
        this.recordsService = recordsService;
    }

    @GetMapping("/api/records")
    public RecordsSummary records() {
        return recordsService.getRecordsSummary();
    }

    @GetMapping("/api/champions")
    public List<Champion> champions() {
        return recordsService.getChampions();
    }
}
