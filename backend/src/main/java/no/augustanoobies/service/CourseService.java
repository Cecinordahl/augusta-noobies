package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Course;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CourseService {

    private final FirestoreCollection<Course> collection;

    public CourseService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "courses",
                doc -> new Course(doc.getId(), doc.getString("name"), doc.getString("localRules")),
                CourseService::toMap,
                (course, id) -> new Course(id, course.name(), course.localRules())
        );
    }

    private static Map<String, Object> toMap(Course course) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", course.name());
        map.put("localRules", course.localRules());
        return map;
    }

    public List<Course> list() {
        return collection.list();
    }

    public Course get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Course not found: " + id));
    }

    public Course create(Course course) {
        return collection.create(course);
    }

    public Course update(String id, Course course) {
        get(id);
        return collection.update(id, course);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
