package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Highlight;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HighlightService {

    private final FirestoreCollection<Highlight> collection;

    public HighlightService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "highlights",
                doc -> new Highlight(doc.getId(), doc.getString("tournamentId"), doc.getString("text"),
                        doc.getString("author")),
                HighlightService::toMap,
                (highlight, id) -> new Highlight(id, highlight.tournamentId(), highlight.text(), highlight.author())
        );
    }

    private static Map<String, Object> toMap(Highlight highlight) {
        Map<String, Object> map = new HashMap<>();
        map.put("tournamentId", highlight.tournamentId());
        map.put("text", highlight.text());
        map.put("author", highlight.author());
        return map;
    }

    public List<Highlight> list(String tournamentId) {
        return tournamentId == null ? collection.list() : collection.listWhere("tournamentId", tournamentId);
    }

    public Highlight get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Highlight not found: " + id));
    }

    public Highlight create(Highlight highlight) {
        return collection.create(highlight);
    }

    public Highlight update(String id, Highlight highlight) {
        get(id);
        return collection.update(id, highlight);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
