package no.augustanoobies.service;

import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Player;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import no.augustanoobies.firestore.FirestoreMapping;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlayerService {

    private final FirestoreCollection<Player> collection;

    public PlayerService(Firestore db) {
        this.collection = new FirestoreCollection<>(
                db,
                "players",
                doc -> new Player(doc.getId(), doc.getString("name"), doc.getString("photoUrl"),
                        FirestoreMapping.intOf(doc.getLong("joinedYear"))),
                PlayerService::toMap,
                (player, id) -> new Player(id, player.name(), player.photoUrl(), player.joinedYear())
        );
    }

    private static Map<String, Object> toMap(Player player) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", player.name());
        map.put("photoUrl", player.photoUrl());
        map.put("joinedYear", player.joinedYear());
        return map;
    }

    public List<Player> list() {
        return collection.list();
    }

    public Player get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Player not found: " + id));
    }

    public Player create(Player player) {
        return collection.create(player);
    }

    public Player update(String id, Player player) {
        get(id);
        return collection.update(id, player);
    }

    public void delete(String id) {
        collection.delete(id);
    }
}
