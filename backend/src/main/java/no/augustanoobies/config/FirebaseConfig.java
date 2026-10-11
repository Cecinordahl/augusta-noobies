package no.augustanoobies.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

/**
 * Credentials come from FIREBASE_SERVICE_ACCOUNT_B64 in deployed environments (Render can't
 * mount an arbitrary file), falling back to a local firebase-service-account.json for dev so
 * nobody needs to fight with base64 on their own machine.
 *
 * Only Firestore + Auth (token verification) use Firebase here — photos are stored in
 * Cloudinary (see CloudinaryConfig), not Firebase Storage.
 */
@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }
        FirebaseOptions options = FirebaseOptions.builder().setCredentials(loadCredentials()).build();
        return FirebaseApp.initializeApp(options);
    }

    @Bean
    public Firestore firestore(FirebaseApp app) {
        return FirestoreClient.getFirestore(app);
    }

    private GoogleCredentials loadCredentials() throws IOException {
        String base64 = System.getenv("FIREBASE_SERVICE_ACCOUNT_B64");
        if (base64 != null && !base64.isBlank()) {
            byte[] decoded = Base64.getDecoder().decode(base64);
            return GoogleCredentials.fromStream(new ByteArrayInputStream(decoded));
        }
        Path localFile = Path.of("firebase-service-account.json");
        if (Files.exists(localFile)) {
            try (InputStream in = Files.newInputStream(localFile)) {
                return GoogleCredentials.fromStream(in);
            }
        }
        throw new IllegalStateException(
                "No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT_B64 or place a "
                        + "firebase-service-account.json file in backend/ for local development."
        );
    }
}
