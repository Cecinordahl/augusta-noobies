package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Result;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import no.augustanoobies.firestore.FirestoreMapping;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResultService {

    private final FirestoreCollection<Result> collection;

    public ResultService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "results",
                doc -> new Result(
                        doc.getId(),
                        doc.getString("tournamentId"),
                        doc.getString("playerId"),
                        FirestoreMapping.intOf(doc.getLong("score")),
                        FirestoreMapping.doubleOf(doc.getDouble("hcpPercentage")),
                        FirestoreMapping.intOf(doc.getLong("placement"))
                ),
                ResultService::toMap,
                (result, id) -> new Result(id, result.tournamentId(), result.playerId(), result.score(),
                        result.hcpPercentage(), result.placement())
        );
    }

    private static Map<String, Object> toMap(Result result) {
        Map<String, Object> map = new HashMap<>();
        map.put("tournamentId", result.tournamentId());
        map.put("playerId", result.playerId());
        map.put("score", result.score());
        map.put("hcpPercentage", result.hcpPercentage());
        map.put("placement", result.placement());
        return map;
    }

    public List<Result> list(String tournamentId) {
        return tournamentId == null ? collection.list() : collection.listWhere("tournamentId", tournamentId);
    }

    public Result get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Result not found: " + id));
    }

    public Result create(Result result) {
        return collection.create(result);
    }

    public Result update(String id, Result result) {
        get(id);
        return collection.update(id, result);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
