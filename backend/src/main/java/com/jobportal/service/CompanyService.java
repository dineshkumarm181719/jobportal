package com.jobportal.service;

import com.jobportal.dto.CompanyDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.Company;
import com.jobportal.entity.User;
import com.jobportal.enums.JobStatus;
import com.jobportal.enums.Role;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;

    @Transactional(readOnly = true)
    public PagedResponse<CompanyDTO.CompanyResponse> getAllCompanies(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Company> companyPage;

        if (search != null && !search.trim().isEmpty()) {
            companyPage = companyRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(search.trim(), search.trim(), pageable);
        } else {
            companyPage = companyRepository.findAll(pageable);
        }

        List<CompanyDTO.CompanyResponse> content = companyPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                companyPage.getNumber(),
                companyPage.getSize(),
                companyPage.getTotalElements(),
                companyPage.getTotalPages(),
                companyPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public CompanyDTO.CompanyResponse getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        return mapToResponse(company);
    }

    @Transactional
    public CompanyDTO.CompanyResponse createCompany(CompanyDTO.CompanyRequest request) {
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .location(request.getLocation())
                .industry(request.getIndustry())
                .logo(request.getLogo())
                .build();

        company = companyRepository.save(company);
        return mapToResponse(company);
    }

    @Transactional
    public CompanyDTO.CompanyResponse updateCompany(Long companyId, User user, CompanyDTO.CompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (user.getRole() != Role.SYSTEM_ADMIN && user.getRole() != Role.COMPANY_ADMIN) {
            throw new UnauthorizedException("You do not have permission to update company details.");
        }

        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setIndustry(request.getIndustry());
        if (request.getLogo() != null) {
            company.setLogo(request.getLogo());
        }

        company = companyRepository.save(company);
        return mapToResponse(company);
    }

    public CompanyDTO.CompanyResponse mapToResponse(Company company) {
        long recruitersCount = recruiterRepository.countByCompany(company);
        long openJobsCount = jobRepository.findByCompany(company).stream()
                .filter(j -> j.getStatus() == JobStatus.OPEN)
                .count();

        return CompanyDTO.CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .location(company.getLocation())
                .industry(company.getIndustry())
                .logo(company.getLogo())
                .recruitersCount(recruitersCount)
                .openJobsCount(openJobsCount)
                .createdAt(company.getCreatedAt())
                .build();
    }
}
