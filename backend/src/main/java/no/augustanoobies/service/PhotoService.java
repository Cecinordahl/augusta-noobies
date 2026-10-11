package no.augustanoobies.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.cloud.firestore.Firestore;
import no.augustanoobies.dto.Photo;
import no.augustanoobies.exception.NotFoundException;
import no.augustanoobies.firestore.FirestoreCollection;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PhotoService {

    private final FirestoreCollection<Photo> collection;
    private final Cloudinary cloudinary;

    public PhotoService(Firestore db, Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
        this.collection = new FirestoreCollection<>(
                db,
                "photos",
                doc -> new Photo(doc.getId(), doc.getString("tournamentId"), doc.getString("url"),
                        doc.getString("storagePath"), doc.getString("caption")),
                PhotoService::toMap,
                (photo, id) -> new Photo(id, photo.tournamentId(), photo.url(), photo.storagePath(), photo.caption())
        );
    }

    private static Map<String, Object> toMap(Photo photo) {
        Map<String, Object> map = new HashMap<>();
        map.put("tournamentId", photo.tournamentId());
        map.put("url", photo.url());
        map.put("storagePath", photo.storagePath());
        map.put("caption", photo.caption());
        return map;
    }

    public List<Photo> list(String tournamentId) {
        return tournamentId == null ? collection.list() : collection.listWhere("tournamentId", tournamentId);
    }

    public Photo get(String id) {
        return collection.get(id).orElseThrow(() -> new NotFoundException("Photo not found: " + id));
    }

    @SuppressWarnings("unchecked")
    public Photo upload(String tournamentId, String caption, MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "augusta-noobies/" + tournamentId,
                "resource_type", "image"
        ));
        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");
        Photo photo = new Photo(null, tournamentId, url, publicId, caption);
        return collection.create(photo);
    }

    public void delete(String id) {
        Photo photo = get(id);
        try {
            cloudinary.uploader().destroy(photo.storagePath(), ObjectUtils.emptyMap());
        } catch (Exception ignored) {
            // Best-effort cleanup; don't block deleting the record if Cloudinary is unreachable.
        }
        collection.delete(id);
    }
}
