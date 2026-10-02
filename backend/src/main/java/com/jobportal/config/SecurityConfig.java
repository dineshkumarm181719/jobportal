package com.jobportal.config;

import com.jobportal.security.CustomUserDetailsService;
import com.jobportal.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;
    private final CorsConfig corsConfig;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/", "/favicon.ico", "/h2-console/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/companies", "/api/companies/{id}").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        
                        // Candidate endpoints
                        .requestMatchers("/api/candidates/**").hasRole("CANDIDATE")
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("CANDIDATE")
                        .requestMatchers(HttpMethod.GET, "/api/applications/my").hasRole("CANDIDATE")

                        // Recruiter endpoints
                        .requestMatchers("/api/recruiter/**").hasAnyRole("RECRUITER", "COMPANY_ADMIN", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/jobs").hasAnyRole("RECRUITER", "COMPANY_ADMIN", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/jobs/**").hasAnyRole("RECRUITER", "COMPANY_ADMIN", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasAnyRole("RECRUITER", "COMPANY_ADMIN", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/applications/*/status").hasAnyRole("RECRUITER", "COMPANY_ADMIN", "SYSTEM_ADMIN")
                        .requestMatchers("/api/interviews/**").hasAnyRole("RECRUITER", "CANDIDATE", "COMPANY_ADMIN", "SYSTEM_ADMIN")

                        // Company Admin endpoints
                        .requestMatchers("/api/company/**").hasAnyRole("COMPANY_ADMIN", "SYSTEM_ADMIN")

                        // System Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("SYSTEM_ADMIN")

                        // Authenticated endpoints (Notifications, shared profile, etc.)
                        .requestMatchers("/api/notifications/**").authenticated()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
