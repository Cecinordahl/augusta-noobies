package no.augustanoobies.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import no.augustanoobies.dto.ApiError;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * Public GET/OPTIONS pass straight through; only mutating /api/** requests are checked. Rejects
 * with 401 (no/invalid token) or 403 (valid Firebase user, but not on the admins allowlist) so
 * the frontend can tell the two cases apart.
 */
@Component
public class AdminAuthFilter extends OncePerRequestFilter {

    private static final Set<String> PROTECTED_METHODS = Set.of("POST", "PUT", "DELETE", "PATCH");

    private final Firestore firestore;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdminAuthFilter(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return !path.startsWith("/api/") || !PROTECTED_METHODS.contains(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            reject(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing bearer token");
            return;
        }

        String idToken = header.substring("Bearer ".length()).trim();
        FirebaseToken token;
        try {
            token = FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            reject(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }

        String email = token.getEmail();
        if (email == null || email.isBlank()) {
            reject(response, HttpServletResponse.SC_FORBIDDEN, "Not an admin");
            return;
        }

        try {
            boolean isAdmin = firestore.collection("admins").document(email.toLowerCase()).get().get().exists();
            if (!isAdmin) {
                reject(response, HttpServletResponse.SC_FORBIDDEN, "Not an admin");
                return;
            }
        } catch (Exception e) {
            reject(response, HttpServletResponse.SC_FORBIDDEN, "Not an admin");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void reject(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(new ApiError(message)));
    }
}
