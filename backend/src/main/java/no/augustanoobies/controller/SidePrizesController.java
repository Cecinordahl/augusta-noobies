package no.augustanoobies.controller;

import no.augustanoobies.dto.SidePrize;
import no.augustanoobies.dto.SidePrizeInput;
import no.augustanoobies.service.SidePrizeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/side-prizes")
public class SidePrizesController {

    private final SidePrizeService service;

    public SidePrizesController(SidePrizeService service) {
        this.service = service;
    }

    @GetMapping
    public List<SidePrize> list(@RequestParam(required = false) String tournamentId) {
        return service.list(tournamentId);
    }

    @GetMapping("/{id}")
    public SidePrize get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SidePrize create(@RequestBody SidePrizeInput input) {
        return service.create(toSidePrize(null, input));
    }

    @PutMapping("/{id}")
    public SidePrize update(@PathVariable String id, @RequestBody SidePrizeInput input) {
        return service.update(id, toSidePrize(id, input));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private static SidePrize toSidePrize(String id, SidePrizeInput input) {
        return new SidePrize(id, input.tournamentId(), input.title(), input.winnerPlayerId(), input.description());
    }
}
