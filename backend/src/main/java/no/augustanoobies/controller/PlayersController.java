package no.augustanoobies.controller;

import no.augustanoobies.dto.Player;
import no.augustanoobies.dto.PlayerInput;
import no.augustanoobies.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayersController {

    private final PlayerService service;

    public PlayersController(PlayerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Player> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Player get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Player create(@RequestBody PlayerInput input) {
        return service.create(new Player(null, input.name(), input.photoUrl(), input.joinedYear()));
    }

    @PutMapping("/{id}")
    public Player update(@PathVariable String id, @RequestBody PlayerInput input) {
        return service.update(id, new Player(id, input.name(), input.photoUrl(), input.joinedYear()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
