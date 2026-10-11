package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.SidePrize;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SidePrizeService {

    private final FirestoreCollection<SidePrize> collection;

    public SidePrizeService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "sidePrizes",
                doc -> new SidePrize(doc.getId(), doc.getString("tournamentId"), doc.getString("title"),
                        doc.getString("winnerPlayerId"), doc.getString("description")),
                SidePrizeService::toMap,
                (sidePrize, id) -> new SidePrize(id, sidePrize.tournamentId(), sidePrize.title(),
                        sidePrize.winnerPlayerId(), sidePrize.description())
        );
    }

    private static Map<String, Object> toMap(SidePrize sidePrize) {
        Map<String, Object> map = new HashMap<>();
        map.put("tournamentId", sidePrize.tournamentId());
        map.put("title", sidePrize.title());
        map.put("winnerPlayerId", sidePrize.winnerPlayerId());
        map.put("description", sidePrize.description());
        return map;
    }

    public List<SidePrize> list(String tournamentId) {
        return tournamentId == null ? collection.list() : collection.listWhere("tournamentId", tournamentId);
    }

    public SidePrize get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Side prize not found: " + id));
    }

    public SidePrize create(SidePrize sidePrize) {
        return collection.create(sidePrize);
    }

    public SidePrize update(String id, SidePrize sidePrize) {
        get(id);
        return collection.update(id, sidePrize);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
