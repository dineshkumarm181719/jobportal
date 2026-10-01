package com.jobportal.service;

import com.jobportal.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document");

        // Prevent path traversal
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence " + originalFilename);
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid file format. Only PDF, DOC, and DOCX files are permitted.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            // Some browsers send generic octet-stream, so also verify extension
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new BadRequestException("Invalid file type: " + contentType);
            }
        }

        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}
