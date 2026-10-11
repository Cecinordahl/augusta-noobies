package no.augustanoobies.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import no.augustanoobies.dto.UploadResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Generic image upload for entities that just need a single photoUrl (e.g. a player's profile
 * photo) rather than a Firestore-tracked photo record — see PhotoService for the latter.
 */
@Service
public class UploadService {

    private final Cloudinary cloudinary;

    public UploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @SuppressWarnings("unchecked")
    public UploadResult upload(String folder, MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "augusta-noobies/" + (folder == null || folder.isBlank() ? "misc" : folder),
                "resource_type", "image"
        ));
        return new UploadResult((String) uploadResult.get("secure_url"));
    }
}
