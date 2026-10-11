package no.augustanoobies.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Photo storage lives in Cloudinary, not Firebase Storage (Firebase Storage requires the Blaze
 * plan to provision a bucket on new projects; Cloudinary's free tier needs no billing setup).
 */
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        String url = System.getenv("CLOUDINARY_URL");
        if (url == null || url.isBlank()) {
            throw new IllegalStateException(
                    "CLOUDINARY_URL is not set. Get it from the Cloudinary dashboard "
                            + "(cloudinary://<api_key>:<api_secret>@<cloud_name>) and set it as an env var."
            );
        }
        return new Cloudinary(url);
    }
}
