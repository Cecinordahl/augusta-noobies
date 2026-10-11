package no.augustanoobies.firestore;

import java.util.List;

public final class FirestoreMapping {

    private FirestoreMapping() {
    }

    public static int intOf(Long value) {
        return value == null ? 0 : value.intValue();
    }

    public static double doubleOf(Double value) {
        return value == null ? 0.0 : value;
    }

    public static List<String> stringListOf(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }
}
