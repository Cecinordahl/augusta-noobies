package no.augustanoobies.controller;

import no.augustanoobies.dto.Result;
import no.augustanoobies.dto.ResultInput;
import no.augustanoobies.service.ResultService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultsController {

    private final ResultService service;

    public ResultsController(ResultService service) {
        this.service = service;
    }

    @GetMapping
    public List<Result> list(@RequestParam(required = false) String tournamentId) {
        return service.list(tournamentId);
    }

    @GetMapping("/{id}")
    public Result get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result create(@RequestBody ResultInput input) {
        return service.create(toResult(null, input));
    }

    @PutMapping("/{id}")
    public Result update(@PathVariable String id, @RequestBody ResultInput input) {
        return service.update(id, toResult(id, input));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private static Result toResult(String id, ResultInput input) {
        return new Result(id, input.tournamentId(), input.playerId(), input.score(), input.hcpPercentage(), input.placement());
    }
}
