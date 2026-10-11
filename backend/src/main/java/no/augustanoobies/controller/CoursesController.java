package no.augustanoobies.controller;

import no.augustanoobies.dto.Course;
import no.augustanoobies.dto.CourseInput;
import no.augustanoobies.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {

    private final CourseService service;

    public CoursesController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Course> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@RequestBody CourseInput input) {
        return service.create(new Course(null, input.name(), input.localRules()));
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable String id, @RequestBody CourseInput input) {
        return service.update(id, new Course(id, input.name(), input.localRules()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
