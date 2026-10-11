package no.augustanoobies.firestore;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Thin generic wrapper over a Firestore collection shared by every entity service, so the
 * get/list/create/update/delete boilerplate isn't repeated across seven near-identical services.
 */
public class FirestoreCollection<T> {

    private final CollectionReference collection;
    private final Function<DocumentSnapshot, T> fromDoc;
    private final Function<T, Map<String, Object>> toMap;
    private final BiFunction<T, String, T> withId;

    public FirestoreCollection(
            Firestore db,
            String name,
            Function<DocumentSnapshot, T> fromDoc,
            Function<T, Map<String, Object>> toMap,
            BiFunction<T, String, T> withId
    ) {
        this.collection = db.collection(name);
        this.fromDoc = fromDoc;
        this.toMap = toMap;
        this.withId = withId;
    }

    public List<T> list() {
        QuerySnapshot snapshot = await(collection.get());
        return snapshot.getDocuments().stream().map(fromDoc).collect(Collectors.toList());
    }

    public List<T> listWhere(String field, Object value) {
        QuerySnapshot snapshot = await(collection.whereEqualTo(field, value).get());
        return snapshot.getDocuments().stream().map(fromDoc).collect(Collectors.toList());
    }

    public Optional<T> get(String id) {
        DocumentSnapshot snapshot = await(collection.document(id).get());
        if (!snapshot.exists()) {
            return Optional.empty();
        }
        return Optional.ofNullable(fromDoc.apply(snapshot));
    }

    public T create(T value) {
        DocumentReference ref = collection.document();
        await(ref.set(toMap.apply(value)));
        return withId.apply(value, ref.getId());
    }

    public T createWithId(String id, T value) {
        DocumentReference ref = collection.document(id);
        await(ref.set(toMap.apply(value)));
        return withId.apply(value, id);
    }

    public T update(String id, T value) {
        DocumentReference ref = collection.document(id);
        await(ref.set(toMap.apply(value)));
        return withId.apply(value, id);
    }

    public void delete(String id) {
        await(collection.document(id).delete());
    }

    private <R> R await(com.google.api.core.ApiFuture<R> future) {
        try {
            return future.get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while talking to Firestore", e);
        } catch (ExecutionException e) {
            throw new RuntimeException("Firestore operation failed", e.getCause());
        }
    }
}
