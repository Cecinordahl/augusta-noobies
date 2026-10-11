package no.augustanoobies.controller;

import no.augustanoobies.dto.Tournament;
import no.augustanoobies.dto.TournamentInput;
import no.augustanoobies.service.TournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentsController {

    private final TournamentService service;

    public TournamentsController(TournamentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tournament> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Tournament get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tournament create(@RequestBody TournamentInput input) {
        return service.create(toTournament(null, input));
    }

    @PutMapping("/{id}")
    public Tournament update(@PathVariable String id, @RequestBody TournamentInput input) {
        return service.update(id, toTournament(id, input));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private static Tournament toTournament(String id, TournamentInput input) {
        return new Tournament(id, input.year(), input.date(), input.location(), input.courseId(),
                input.hcpPercentage(), input.status(), input.registeredPlayerIds());
    }
}
