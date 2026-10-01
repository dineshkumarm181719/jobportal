package com.jobportal.service;

import com.jobportal.dto.CandidateDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Resume;
import com.jobportal.entity.Skill;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.SkillRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ResumeRepository resumeRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public CandidateDTO.CandidateResponse getCandidateProfile(User user) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> {
                    Candidate newCand = Candidate.builder().user(user).build();
                    return candidateRepository.save(newCand);
                });
        return mapToResponse(candidate);
    }

    @Transactional(readOnly = true)
    public CandidateDTO.CandidateResponse getCandidateById(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", candidateId));
        return mapToResponse(candidate);
    }

    @Transactional
    public CandidateDTO.CandidateResponse updateCandidateProfile(User user, CandidateDTO.CandidateProfileRequest request) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> {
                    Candidate newCand = Candidate.builder().user(user).build();
                    return candidateRepository.save(newCand);
                });

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        if (request.getProfileSummary() != null) {
            candidate.setProfileSummary(request.getProfileSummary());
        }
        if (request.getLocation() != null) {
            candidate.setLocation(request.getLocation());
        }
        if (request.getExperience() != null) {
            candidate.setExperience(request.getExperience());
        }
        if (request.getEducation() != null) {
            candidate.setEducation(request.getEducation());
        }

        if (request.getSkills() != null) {
            Set<Skill> skillEntities = new HashSet<>();
            for (String skillName : request.getSkills()) {
                String cleanName = skillName.trim();
                if (!cleanName.isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    skillEntities.add(skill);
                }
            }
            candidate.setSkills(skillEntities);
        }

        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    @Transactional
    public CandidateDTO.ResumeResponse uploadResume(User user, MultipartFile file) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found for user: " + user.getEmail()));

        String storedFileName = fileStorageService.storeFile(file);

        Resume resume = Resume.builder()
                .candidate(candidate)
                .fileName(file.getOriginalFilename())
                .filePath("/uploads/" + storedFileName)
                .fileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                .fileSize(file.getSize())
                .build();

        resume = resumeRepository.save(resume);

        return CandidateDTO.ResumeResponse.builder()
                .id(resume.getId())
                .candidateId(candidate.getId())
                .fileName(resume.getFileName())
                .filePath(resume.getFilePath())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }

    @Transactional
    public void deleteResume(User user, Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", resumeId));

        if (!resume.getCandidate().getUser().getId().equals(user.getId()) && user.getRole() != Role.SYSTEM_ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this resume");
        }

        resumeRepository.delete(resume);
    }

    @Transactional(readOnly = true)
    public PagedResponse<CandidateDTO.CandidateResponse> getAllCandidates(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Candidate> candidates = candidateRepository.findAll(pageable);
        List<CandidateDTO.CandidateResponse> content = candidates.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                candidates.getNumber(),
                candidates.getSize(),
                candidates.getTotalElements(),
                candidates.getTotalPages(),
                candidates.isLast()
        );
    }

    public CandidateDTO.CandidateResponse mapToResponse(Candidate candidate) {
        List<CandidateDTO.ResumeResponse> resumeResponses = resumeRepository.findByCandidateOrderByUploadedAtDesc(candidate)
                .stream()
                .map(r -> CandidateDTO.ResumeResponse.builder()
                        .id(r.getId())
                        .candidateId(candidate.getId())
                        .fileName(r.getFileName())
                        .filePath(r.getFilePath())
                        .fileType(r.getFileType())
                        .fileSize(r.getFileSize())
                        .uploadedAt(r.getUploadedAt())
                        .build())
                .collect(Collectors.toList());

        Set<String> skillNames = candidate.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return CandidateDTO.CandidateResponse.builder()
                .id(candidate.getId())
                .userId(candidate.getUser().getId())
                .name(candidate.getUser().getName())
                .email(candidate.getUser().getEmail())
                .phone(candidate.getUser().getPhone())
                .profileSummary(candidate.getProfileSummary())
                .location(candidate.getLocation())
                .experience(candidate.getExperience())
                .education(candidate.getEducation())
                .skills(skillNames)
                .resumes(resumeResponses)
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }
}
