package no.augustanoobies.controller;

import no.augustanoobies.dto.Photo;
import no.augustanoobies.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotosController {

    private final PhotoService service;

    public PhotosController(PhotoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Photo> list(@RequestParam(required = false) String tournamentId) {
        return service.list(tournamentId);
    }

    @GetMapping("/{id}")
    public Photo get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public Photo upload(
            @RequestParam String tournamentId,
            @RequestParam(required = false) String caption,
            @RequestParam MultipartFile file
    ) throws IOException {
        return service.upload(tournamentId, caption, file);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
