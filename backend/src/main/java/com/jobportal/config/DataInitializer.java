package com.jobportal.config;

import com.jobportal.entity.*;
import com.jobportal.enums.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data generation.");
            return;
        }

        log.info("Starting database seeding for CareerSync Job Portal...");

        // 1. Create Skills
        Skill java = getOrCreateSkill("Java");
        Skill springBoot = getOrCreateSkill("Spring Boot");
        Skill react = getOrCreateSkill("React.js");
        Skill typeScript = getOrCreateSkill("TypeScript");
        Skill nodeJs = getOrCreateSkill("Node.js");
        Skill postgres = getOrCreateSkill("PostgreSQL");
        Skill docker = getOrCreateSkill("Docker");
        Skill kubernetes = getOrCreateSkill("Kubernetes");
        Skill aws = getOrCreateSkill("AWS");
        Skill python = getOrCreateSkill("Python");
        Skill tailwind = getOrCreateSkill("Tailwind CSS");
        Skill microservices = getOrCreateSkill("Microservices");

        // 2. Create Companies
        Company techCorp = companyRepository.save(Company.builder()
                .name("TechCorp Solutions")
                .description("Global enterprise software consulting and scalable cloud architecture leader.")
                .website("https://techcorp-example.com")
                .location("San Francisco, CA")
                .industry("Enterprise Software")
                .logo("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80")
                .build());

        Company cloudScale = companyRepository.save(Company.builder()
                .name("CloudScale Networks")
                .description("Next-generation distributed infrastructure and cloud security systems.")
                .website("https://cloudscale-example.com")
                .location("Seattle, WA")
                .industry("Cloud & DevOps")
                .logo("https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80")
                .build());

        Company innovateAI = companyRepository.save(Company.builder()
                .name("Innovate AI Labs")
                .description("Pioneering cutting-edge LLMs and multimodal artificial intelligence products.")
                .website("https://innovateai-example.com")
                .location("Austin, TX")
                .industry("Artificial Intelligence")
                .logo("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80")
                .build());

        // 3. Create System Admin
        User sysAdmin = userRepository.save(User.builder()
                .name("System Administrator")
                .email("admin@careersync.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phone("+1 555-0100")
                .role(Role.SYSTEM_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        // 4. Create Company Admins
        User techAdminUser = userRepository.save(User.builder()
                .name("Marcus Vance")
                .email("techcorp.admin@careersync.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phone("+1 555-0101")
                .role(Role.COMPANY_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        Recruiter techCorpAdminRecruiter = recruiterRepository.save(Recruiter.builder()
                .user(techAdminUser)
                .company(techCorp)
                .designation("Head of Talent Acquisition")
                .build());

        User cloudAdminUser = userRepository.save(User.builder()
                .name("Elena Rostova")
                .email("cloudscale.admin@careersync.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phone("+1 555-0102")
                .role(Role.COMPANY_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        Recruiter cloudAdminRecruiter = recruiterRepository.save(Recruiter.builder()
                .user(cloudAdminUser)
                .company(cloudScale)
                .designation("Director of People Operations")
                .build());

        // 5. Create Recruiters
        User sarahUser = userRepository.save(User.builder()
                .name("Sarah Jenkins")
                .email("sarah.recruiter@techcorp.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .phone("+1 555-0103")
                .role(Role.RECRUITER)
                .status(UserStatus.ACTIVE)
                .build());

        Recruiter sarahRecruiter = recruiterRepository.save(Recruiter.builder()
                .user(sarahUser)
                .company(techCorp)
                .designation("Senior Tech Recruiter")
                .build());

        User davidUser = userRepository.save(User.builder()
                .name("David Chen")
                .email("david.recruiter@cloudscale.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .phone("+1 555-0104")
                .role(Role.RECRUITER)
                .status(UserStatus.ACTIVE)
                .build());

        Recruiter davidRecruiter = recruiterRepository.save(Recruiter.builder()
                .user(davidUser)
                .company(cloudScale)
                .designation("Lead Technical Recruiter")
                .build());

        User emmaUser = userRepository.save(User.builder()
                .name("Emma Watson")
                .email("emma.recruiter@innovate.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .phone("+1 555-0105")
                .role(Role.RECRUITER)
                .status(UserStatus.ACTIVE)
                .build());

        Recruiter emmaRecruiter = recruiterRepository.save(Recruiter.builder()
                .user(emmaUser)
                .company(innovateAI)
                .designation("AI Talent Partner")
                .build());

        // 6. Create Candidates
        User alexUser = userRepository.save(User.builder()
                .name("Alex Turner")
                .email("alex.turner@gmail.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .phone("+1 555-0201")
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build());

        Candidate alexCand = candidateRepository.save(Candidate.builder()
                .user(alexUser)
                .profileSummary("Senior Full Stack Java & React Engineer with 6+ years designing microservices architectures and resilient distributed systems.")
                .location("San Francisco, CA")
                .experience("6 years")
                .education("B.S. in Computer Science, UC Berkeley")
                .skills(new HashSet<>(Arrays.asList(java, springBoot, react, postgres, docker, microservices)))
                .build());

        User priyaUser = userRepository.save(User.builder()
                .name("Priya Sharma")
                .email("priya.sharma@gmail.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .phone("+1 555-0202")
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build());

        Candidate priyaCand = candidateRepository.save(Candidate.builder()
                .user(priyaUser)
                .profileSummary("Frontend Architect specializing in React, TypeScript, Next.js, and design systems. Passionate about web performance and UX accessibility.")
                .location("New York, NY")
                .experience("4 years")
                .education("M.S. in Software Engineering, Carnegie Mellon")
                .skills(new HashSet<>(Arrays.asList(react, typeScript, tailwind, nodeJs)))
                .build());

        User johnUser = userRepository.save(User.builder()
                .name("John Doe")
                .email("john.doe@gmail.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .phone("+1 555-0203")
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build());

        Candidate johnCand = candidateRepository.save(Candidate.builder()
                .user(johnUser)
                .profileSummary("Cloud & DevOps Engineer with extensive experience in AWS, Kubernetes, Terraform, CI/CD automation and containerization.")
                .location("Austin, TX")
                .experience("5 years")
                .education("B.E. in Information Technology, UT Austin")
                .skills(new HashSet<>(Arrays.asList(aws, docker, kubernetes, python)))
                .build());

        User emilyUser = userRepository.save(User.builder()
                .name("Emily Clark")
                .email("emily.clark@gmail.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .phone("+1 555-0204")
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build());

        Candidate emilyCand = candidateRepository.save(Candidate.builder()
                .user(emilyUser)
                .profileSummary("Backend Software Developer focused on high-throughput REST APIs, Spring Boot, event-driven architectures and PostgreSQL optimization.")
                .location("Seattle, WA")
                .experience("3 years")
                .education("B.S. in Computer Science, University of Washington")
                .skills(new HashSet<>(Arrays.asList(java, springBoot, postgres, microservices)))
                .build());

        User michaelUser = userRepository.save(User.builder()
                .name("Michael Brown")
                .email("michael.brown@gmail.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .phone("+1 555-0205")
                .role(Role.CANDIDATE)
                .status(UserStatus.ACTIVE)
                .build());

        Candidate michaelCand = candidateRepository.save(Candidate.builder()
                .user(michaelUser)
                .profileSummary("Machine Learning & Python Engineer building LLM applications, retrieval-augmented generation pipelines and deep learning systems.")
                .location("Boston, MA")
                .experience("4 years")
                .education("M.S. in Artificial Intelligence, MIT")
                .skills(new HashSet<>(Arrays.asList(python, aws, docker, postgres)))
                .build());

        // 7. Create 10 Rich Jobs
        Job job1 = jobRepository.save(Job.builder()
                .company(techCorp)
                .recruiter(sarahRecruiter)
                .title("Senior Full Stack Engineer (Java + React)")
                .description("We are seeking a talented Senior Full Stack Engineer to lead the modernization of our core enterprise platforms. You will design resilient Spring Boot microservices, build modular React frontends, and mentor junior engineers in software craftsmanship.")
                .requirements("- 5+ years building enterprise applications with Java & Spring Boot\n- Strong proficiency in modern React and TypeScript\n- Experience designing PostgreSQL schemas and indexing strategies\n- Solid understanding of Docker and CI/CD pipelines")
                .location("San Francisco, CA")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("5-8 years")
                .salaryMin(new BigDecimal("140000"))
                .salaryMax(new BigDecimal("175000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(java, springBoot, react, postgres, microservices)))
                .build());

        Job job2 = jobRepository.save(Job.builder()
                .company(techCorp)
                .recruiter(sarahRecruiter)
                .title("Staff Backend Architect (Spring Boot & Cloud)")
                .description("Drive backend architectural decisions across multiple product streams. You will be responsible for defining service boundaries, API contracts, high-throughput message processing, and zero-downtime database migrations.")
                .requirements("- 8+ years backend engineering with Java ecosystem\n- Deep knowledge of Spring Cloud, Kafka, and distributed systems\n- Proven track record of scaling systems to millions of daily requests\n- Excellent architectural communication skills")
                .location("Remote")
                .employmentType(EmploymentType.REMOTE)
                .experienceRequired("8+ years")
                .salaryMin(new BigDecimal("170000"))
                .salaryMax(new BigDecimal("210000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(3))
                .skills(new HashSet<>(Arrays.asList(java, springBoot, microservices, aws, docker)))
                .build());

        Job job3 = jobRepository.save(Job.builder()
                .company(cloudScale)
                .recruiter(davidRecruiter)
                .title("Lead DevOps & Infrastructure Engineer")
                .description("Join CloudScale's core platform team to build automated Kubernetes clusters, maintain multi-region AWS cloud deployments, and ensure 99.99% system availability.")
                .requirements("- Hands-on expertise with AWS, Kubernetes, Terraform, and Helm\n- Strong experience in Docker containerization and security hardening\n- Scripting proficiency in Python or Go\n- Monitoring and alerting with Prometheus & Grafana")
                .location("Seattle, WA")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("4-7 years")
                .salaryMin(new BigDecimal("150000"))
                .salaryMax(new BigDecimal("185000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(1))
                .skills(new HashSet<>(Arrays.asList(aws, kubernetes, docker, python)))
                .build());

        Job job4 = jobRepository.save(Job.builder()
                .company(cloudScale)
                .recruiter(davidRecruiter)
                .title("Frontend Developer (React, Tailwind & Design Systems)")
                .description("Collaborate with our product design team to craft sleek, responsive, and accessible user interfaces for our cloud telemetry dashboard.")
                .requirements("- 3+ years experience with React, TypeScript, and modern CSS frameworks (Tailwind)\n- Deep understanding of state management, hooks, and component life cycles\n- Experience building data visualization dashboards")
                .location("Seattle, WA")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("3-5 years")
                .salaryMin(new BigDecimal("115000"))
                .salaryMax(new BigDecimal("145000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(react, typeScript, tailwind)))
                .build());

        Job job5 = jobRepository.save(Job.builder()
                .company(innovateAI)
                .recruiter(emmaRecruiter)
                .title("Senior AI & Machine Learning Engineer")
                .description("Build next-generation generative AI workflows and fine-tune foundation models for enterprise document analysis and real-time semantic search.")
                .requirements("- 4+ years building production ML systems\n- Deep expertise with Python, PyTorch, LangChain, and vector databases\n- Experience deploying models on AWS SageMaker or Kubernetes\n- M.S. or Ph.D. preferred")
                .location("Austin, TX")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("4-6 years")
                .salaryMin(new BigDecimal("160000"))
                .salaryMax(new BigDecimal("200000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(python, aws, docker)))
                .build());

        Job job6 = jobRepository.save(Job.builder()
                .company(innovateAI)
                .recruiter(emmaRecruiter)
                .title("Full Stack Web Engineer (Python / React)")
                .description("Connect advanced AI backend APIs to clean, interactive web experiences. You will develop both backend endpoints in FastAPI/Spring and rich frontend interactive apps.")
                .requirements("- 3+ years full stack development\n- Fluency in React and Python or Java\n- Experience consuming AI / REST endpoints with low latency")
                .location("Remote")
                .employmentType(EmploymentType.REMOTE)
                .experienceRequired("3-5 years")
                .salaryMin(new BigDecimal("130000"))
                .salaryMax(new BigDecimal("160000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(react, python, postgres, docker)))
                .build());

        Job job7 = jobRepository.save(Job.builder()
                .company(techCorp)
                .recruiter(sarahRecruiter)
                .title("Junior Java Backend Developer")
                .description("Kickstart your enterprise engineering career! Work closely with staff architects to build RESTful microservices, write comprehensive integration tests, and optimize SQL queries.")
                .requirements("- 1-2 years experience with Java & Spring Framework\n- Solid understanding of OOP, Data Structures, and SQL\n- Eager to learn modern cloud engineering practices")
                .location("San Francisco, CA")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("1-2 years")
                .salaryMin(new BigDecimal("85000"))
                .salaryMax(new BigDecimal("110000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(3))
                .skills(new HashSet<>(Arrays.asList(java, springBoot, postgres)))
                .build());

        Job job8 = jobRepository.save(Job.builder()
                .company(cloudScale)
                .recruiter(davidRecruiter)
                .title("Cloud Solutions Architect (Contract)")
                .description("Guide enterprise clients through multi-cloud migration strategies, security audits, and cloud cost optimization.")
                .requirements("- 6+ years in cloud consulting or solutions architecture\n- AWS / GCP certified solutions architect\n- Strong client-facing presentation and scoping skills")
                .location("Remote")
                .employmentType(EmploymentType.CONTRACT)
                .experienceRequired("6+ years")
                .salaryMin(new BigDecimal("160000"))
                .salaryMax(new BigDecimal("190000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(1))
                .skills(new HashSet<>(Arrays.asList(aws, kubernetes, docker)))
                .build());

        Job job9 = jobRepository.save(Job.builder()
                .company(innovateAI)
                .recruiter(emmaRecruiter)
                .title("Software Engineering Intern (Summer 2026)")
                .description("Exciting 3-month internship program for students looking to gain hands-on experience in production AI engineering, API design, and modern web application development.")
                .requirements("- Currently pursuing BS/MS in Computer Science or related field\n- Proficiency in Java, Python, or JavaScript\n- Strong problem-solving mindset")
                .location("Austin, TX")
                .employmentType(EmploymentType.INTERNSHIP)
                .experienceRequired("0-1 year")
                .salaryMin(new BigDecimal("45000"))
                .salaryMax(new BigDecimal("60000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(python, react, java)))
                .build());

        Job job10 = jobRepository.save(Job.builder()
                .company(techCorp)
                .recruiter(sarahRecruiter)
                .title("Senior Security & Compliance Engineer")
                .description("Lead security audits, implement OAuth2/OIDC protocols, manage cryptographic keys, and ensure platform adherence to SOC2 and ISO27001 standards.")
                .requirements("- 5+ years security engineering in SaaS environments\n- Deep knowledge of application security, OWASP Top 10, and vulnerability management")
                .location("San Francisco, CA")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceRequired("5+ years")
                .salaryMin(new BigDecimal("155000"))
                .salaryMax(new BigDecimal("195000"))
                .status(JobStatus.OPEN)
                .deadline(LocalDate.now().plusMonths(2))
                .skills(new HashSet<>(Arrays.asList(java, aws, docker)))
                .build());

        // 8. Create Sample Applications & Interview Workflow
        Application app1 = applicationRepository.save(Application.builder()
                .candidate(alexCand)
                .job(job1)
                .coverLetter("I am thrilled to apply for the Senior Full Stack Engineer role at TechCorp. With 6 years of deep experience in Java Spring Boot and React microfrontends, I have spearheaded similar platform transformations and would love to contribute to your engineering culture.")
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .build());

        Application app2 = applicationRepository.save(Application.builder()
                .candidate(priyaCand)
                .job(job4)
                .coverLetter("With over 4 years dedicated to building accessible design systems with React and Tailwind CSS, I am confident in elevating CloudScale's user interface to world-class standards.")
                .status(ApplicationStatus.SHORTLISTED)
                .build());

        Application app3 = applicationRepository.save(Application.builder()
                .candidate(johnCand)
                .job(job3)
                .coverLetter("I have managed Kubernetes clusters supporting 99.99% uptime across AWS regions and look forward to strengthening CloudScale's platform reliability.")
                .status(ApplicationStatus.APPLIED)
                .build());

        Application app4 = applicationRepository.save(Application.builder()
                .candidate(emilyCand)
                .job(job7)
                .coverLetter("I have solid foundation in Spring Boot, REST APIs and SQL, and I am excited by TechCorp's high engineering standards.")
                .status(ApplicationStatus.SELECTED)
                .build());

        Application app5 = applicationRepository.save(Application.builder()
                .candidate(michaelCand)
                .job(job5)
                .coverLetter("My graduate work at MIT in generative AI and LLM agents directly aligns with Innovate AI's mission.")
                .status(ApplicationStatus.SHORTLISTED)
                .build());

        // 9. Create Scheduled Interview
        Interview interview1 = interviewRepository.save(Interview.builder()
                .application(app1)
                .recruiter(sarahRecruiter)
                .interviewDate(LocalDate.now().plusDays(3))
                .interviewTime("14:30 EST")
                .interviewMode(InterviewMode.ONLINE)
                .meetingLink("https://meet.google.com/careersync-tech-interview")
                .location("Google Meet")
                .status(InterviewStatus.SCHEDULED)
                .notes("Technical System Architecture and live React/Spring coding session.")
                .build());

        // 10. Create Sample Notifications
        notificationRepository.save(Notification.builder()
                .user(alexUser)
                .title("Interview Scheduled 📅")
                .message("Your interview for 'Senior Full Stack Engineer (Java + React)' with Sarah Jenkins has been scheduled for " +
                        LocalDate.now().plusDays(3) + " at 14:30 EST.")
                .type(NotificationType.INTERVIEW_SCHEDULED)
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(priyaUser)
                .title("Application Shortlisted 🎉")
                .message("Congratulations! CloudScale Networks has shortlisted your application for Frontend Developer.")
                .type(NotificationType.CANDIDATE_SHORTLISTED)
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(sarahUser)
                .title("New Application Received")
                .message("Alex Turner submitted an application for 'Senior Full Stack Engineer (Java + React)'.")
                .type(NotificationType.APPLICATION_SUBMITTED)
                .isRead(true)
                .build());

        notificationRepository.save(Notification.builder()
                .user(sysAdmin)
                .title("System Health Report")
                .message("CareerSync platform initialized successfully. All services operational.")
                .type(NotificationType.SYSTEM_ALERT)
                .isRead(true)
                .build());

        log.info("Database seeding completed successfully with {} users, {} companies, {} jobs, and {} applications.",
                userRepository.count(), companyRepository.count(), jobRepository.count(), applicationRepository.count());
    }

    private Skill getOrCreateSkill(String name) {
        return skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.save(new Skill(name)));
    }
}
