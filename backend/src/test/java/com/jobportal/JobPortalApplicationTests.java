package com.jobportal;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.AuthDTO;
import com.jobportal.dto.JobDTO;
import com.jobportal.entity.User;
import com.jobportal.enums.EmploymentType;
import com.jobportal.enums.JobStatus;
import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtService;
import com.jobportal.service.AuthService;
import com.jobportal.service.JobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class JobPortalApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    void testUserRegistrationAndJwtTokenGeneration() {
        AuthDTO.RegisterRequest request = AuthDTO.RegisterRequest.builder()
                .name("Integration Test User")
                .email("test.candidate@jobportal-test.com")
                .password("Password@123")
                .phone("+1 555-9999")
                .role(Role.CANDIDATE)
                .build();

        AuthDTO.AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Integration Test User", response.getName());
        assertEquals(Role.CANDIDATE, response.getRole());
        assertTrue(jwtService.validateJwtToken(response.getToken()));
        assertEquals("test.candidate@jobportal-test.com", jwtService.getEmailFromJwtToken(response.getToken()));
    }

    @Test
    void testPreventDuplicateEmailRegistration() {
        AuthDTO.RegisterRequest request1 = AuthDTO.RegisterRequest.builder()
                .name("Duplicate Test 1")
                .email("duplicate@jobportal-test.com")
                .password("Password@123")
                .role(Role.CANDIDATE)
                .build();

        authService.register(request1);

        AuthDTO.RegisterRequest request2 = AuthDTO.RegisterRequest.builder()
                .name("Duplicate Test 2")
                .email("duplicate@jobportal-test.com")
                .password("Password@123")
                .role(Role.CANDIDATE)
                .build();

        assertThrows(BadRequestException.class, () -> authService.register(request2));
    }

    @Test
    void testJobSearchWithFilters() {
        var pagedJobs = jobService.searchJobs(
                "Java", null, null, null, null, JobStatus.OPEN, 0, 10, "createdAt", "desc", null
        );

        assertNotNull(pagedJobs);
        assertTrue(pagedJobs.isSuccess());
        assertNotNull(pagedJobs.getData());
    }
}
