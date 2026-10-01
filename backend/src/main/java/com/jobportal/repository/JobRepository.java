package com.jobportal.repository;

import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.enums.EmploymentType;
import com.jobportal.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    Page<Job> findByRecruiter(Recruiter recruiter, Pageable pageable);
    Page<Job> findByCompany(Company company, Pageable pageable);
    List<Job> findByCompany(Company company);
    long countByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:experience IS NULL OR LOWER(j.experienceRequired) LIKE LOWER(CONCAT('%', :experience, '%'))) AND " +
           "(:minSalary IS NULL OR (j.salaryMax IS NOT NULL AND j.salaryMax >= :minSalary))")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("employmentType") EmploymentType employmentType,
            @Param("experience") String experience,
            @Param("minSalary") BigDecimal minSalary,
            @Param("status") JobStatus status,
            Pageable pageable
    );
}
