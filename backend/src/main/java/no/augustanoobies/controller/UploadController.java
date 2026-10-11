package no.augustanoobies.controller;

import no.augustanoobies.dto.UploadResult;
import no.augustanoobies.service.UploadService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService service;

    public UploadController(UploadService service) {
        this.service = service;
    }

    @PostMapping(consumes = "multipart/form-data")
    public UploadResult upload(
            @RequestParam(required = false) String folder,
            @RequestParam MultipartFile file
    ) throws IOException {
        return service.upload(folder, file);
    }
}
