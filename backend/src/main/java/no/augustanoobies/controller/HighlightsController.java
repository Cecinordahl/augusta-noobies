package no.augustanoobies.controller;

import no.augustanoobies.dto.Highlight;
import no.augustanoobies.dto.HighlightInput;
import no.augustanoobies.service.HighlightService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/highlights")
public class HighlightsController {

    private final HighlightService service;

    public HighlightsController(HighlightService service) {
        this.service = service;
    }

    @GetMapping
    public List<Highlight> list(@RequestParam(required = false) String tournamentId) {
        return service.list(tournamentId);
    }

    @GetMapping("/{id}")
    public Highlight get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Highlight create(@RequestBody HighlightInput input) {
        return service.create(toHighlight(null, input));
    }

    @PutMapping("/{id}")
    public Highlight update(@PathVariable String id, @RequestBody HighlightInput input) {
        return service.update(id, toHighlight(id, input));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private static Highlight toHighlight(String id, HighlightInput input) {
        return new Highlight(id, input.tournamentId(), input.text(), input.author());
    }
}
