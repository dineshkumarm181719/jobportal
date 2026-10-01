package com.jobportal.repository;

import com.jobportal.entity.Candidate;
import com.jobportal.entity.Interview;
import com.jobportal.entity.Recruiter;
import com.jobportal.enums.InterviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByApplicationId(Long applicationId);
    
    Page<Interview> findByRecruiter(Recruiter recruiter, Pageable pageable);
    List<Interview> findByRecruiter(Recruiter recruiter);
    
    @Query("SELECT i FROM Interview i WHERE i.application.candidate = :candidate")
    Page<Interview> findByCandidate(@Param("candidate") Candidate candidate, Pageable pageable);

    @Query("SELECT i FROM Interview i WHERE i.application.candidate = :candidate")
    List<Interview> findByCandidate(@Param("candidate") Candidate candidate);

    @Query("SELECT i FROM Interview i WHERE i.recruiter.id = :recruiterId AND i.interviewDate >= :today ORDER BY i.interviewDate ASC, i.interviewTime ASC")
    List<Interview> findUpcomingByRecruiter(@Param("recruiterId") Long recruiterId, @Param("today") LocalDate today);

    @Query("SELECT i FROM Interview i WHERE i.application.candidate.id = :candidateId AND i.interviewDate >= :today ORDER BY i.interviewDate ASC, i.interviewTime ASC")
    List<Interview> findUpcomingByCandidate(@Param("candidateId") Long candidateId, @Param("today") LocalDate today);

    long countByRecruiterAndStatus(Recruiter recruiter, InterviewStatus status);
}
