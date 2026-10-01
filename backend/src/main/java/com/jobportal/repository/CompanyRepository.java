package com.jobportal.repository;

import com.jobportal.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
    Page<Company> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location, Pageable pageable);
}
