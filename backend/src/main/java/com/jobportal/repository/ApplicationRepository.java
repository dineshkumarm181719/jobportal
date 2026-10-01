package com.jobportal.repository;

import com.jobportal.entity.Application;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import com.jobportal.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByCandidateAndJob(Candidate candidate, Job job);
    Boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
    
    Page<Application> findByCandidate(Candidate candidate, Pageable pageable);
    List<Application> findByCandidate(Candidate candidate);
    
    Page<Application> findByJob(Job job, Pageable pageable);
    List<Application> findByJob(Job job);
    
    Page<Application> findByJobId(Long jobId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId")
    Page<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId")
    Page<Application> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    long countByJobRecruiterId(Long recruiterId);
    long countByJobRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);
    long countByCandidate(Candidate candidate);
    long countByCandidateAndStatus(Candidate candidate, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}
