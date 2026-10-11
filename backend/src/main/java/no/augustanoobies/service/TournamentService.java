package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Tournament;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import no.augustanoobies.firestore.FirestoreMapping;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TournamentService {

    private final FirestoreCollection<Tournament> collection;

    public TournamentService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "tournaments",
                doc -> new Tournament(
                        doc.getId(),
                        FirestoreMapping.intOf(doc.getLong("year")),
                        doc.getString("date"),
                        doc.getString("location"),
                        doc.getString("courseId"),
                        FirestoreMapping.doubleOf(doc.getDouble("hcpPercentage")),
                        doc.getString("status"),
                        FirestoreMapping.stringListOf(doc.get("registeredPlayerIds"))
                ),
                TournamentService::toMap,
                (tournament, id) -> new Tournament(id, tournament.year(), tournament.date(), tournament.location(),
                        tournament.courseId(), tournament.hcpPercentage(), tournament.status(), tournament.registeredPlayerIds())
        );
    }

    private static Map<String, Object> toMap(Tournament tournament) {
        Map<String, Object> map = new HashMap<>();
        map.put("year", tournament.year());
        map.put("date", tournament.date());
        map.put("location", tournament.location());
        map.put("courseId", tournament.courseId());
        map.put("hcpPercentage", tournament.hcpPercentage());
        map.put("status", tournament.status());
        map.put("registeredPlayerIds", tournament.registeredPlayerIds() == null ? List.of() : tournament.registeredPlayerIds());
        return map;
    }

    public List<Tournament> list() {
        return collection.list();
    }

    public Tournament get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Tournament not found: " + id));
    }

    /** Doc ID is the year as a string, e.g. "2026", so /tournament/2026 resolves directly. */
    public Tournament create(Tournament tournament) {
        String id = String.valueOf(tournament.year());
        return collection.createWithId(id, tournament);
    }

    public Tournament update(String id, Tournament tournament) {
        get(id);
        return collection.update(id, tournament);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
