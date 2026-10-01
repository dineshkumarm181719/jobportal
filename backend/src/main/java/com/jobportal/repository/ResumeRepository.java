package com.jobportal.repository;

import com.jobportal.entity.Candidate;
import com.jobportal.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByCandidateOrderByUploadedAtDesc(Candidate candidate);
    List<Resume> findByCandidateIdOrderByUploadedAtDesc(Long candidateId);
}
