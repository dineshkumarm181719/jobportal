# CareerSync — Enterprise Full-Stack Job Portal Web Application

CareerSync is a modern, responsive, full-stack Job Portal web application connecting **Job Candidates**, **Corporate Recruiters**, **Companies**, and **System Administrators**. Built using **React.js**, **Spring Boot 3**, **Spring Security**, **JWT Authentication**, **Spring Data JPA**, and **PostgreSQL**.

---

## 🌟 Key Highlights & Features

### 1. Robust RBAC & Security
- **Strict Role-Based Access Control (RBAC)** across four primary roles:
  - `CANDIDATE`: Profile customization, multi-resume management, interactive job search/filtering, direct application submission, application milestone pipeline tracking, interview invitations.
  - `RECRUITER`: Job creation, publication status toggles, candidate screening, resume download/preview, candidate shortlisting/rejection, video interview scheduling with automated notifications.
  - `COMPANY_ADMIN`: Multi-recruiter team provisioning, corporate branding, organizational job audit.
  - `SYSTEM_ADMIN`: Platform-wide user moderation, corporate partner directory management, full job audit, system health analytics.
- **JWT Authentication** with stateless Spring Security filter chain.
- **BCrypt password hashing**.
- **Role-based API authorization** and backend data ownership enforcement.

### 2. Modern Interactive User Interface (React + Tailwind CSS)
- **Glassmorphic navigation** with unread notification badges and popover center.
- **Pre-seeded 1-Click Demo Login** switchers on the login page for instant role testing.
- **Live Search & Filter Bar** (by keyword, location, employment type, minimum salary, and experience levels).
- **1-Click Apply Modal** with cover note support and saved resume selection.
- **Responsive Dashboard Layouts** with collapsible mobile sidebars.
- **Modal Dialogs & Confirmation Prompts** for destructive actions.

### 3. Comprehensive Database & Backend Architecture
- **Layered Architecture**: Controller ➔ Service ➔ Repository ➔ PostgreSQL.
- **10 Database Entities**: User, Candidate, Recruiter, Company, Resume, Skill, Job, Application, Interview, Notification.
- **Multipart File Upload Service**: Secure resume file upload with MIME type and size checks, safe UUID file naming, and path traversal protection.
- **Global RestControllerAdvice**: Standardized JSON error and success envelopes.
- **Automatic Data Initializer**: Auto-seeds 1 System Admin, 2 Company Admins, 3 Recruiters, 5 Candidates, 3 Companies, 10 Rich Jobs, sample applications, interviews, and notifications.

---

## 🏛️ High-Level Architecture

```text
                    ┌─────────────────────────┐
                    │     React.js Client     │
                    │   (Vite + Tailwind CSS) │
                    │                         │
                    │  Pages & Components     │
                    │  Central AuthContext    │
                    │  NotificationContext    │
                    │  Protected Role Routes  │
                    └────────────┬────────────┘
                                 │
                           REST API / JWT
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Spring Boot 3.3     │
                    │                         │
                    │  Security Filter Chain  │
                    │  REST Controllers       │
                    │  Service Business Logic │
                    │  JPA Data Repositories  │
                    │  Global Exception Advice│
                    └────────────┬────────────┘
                                 │
                          Hibernate / JDBC
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       PostgreSQL        │
                    │                         │
                    │  Users & Candidates     │
                    │  Companies & Recruiters │
                    │  Jobs & Applications    │
                    │  Resumes & Skills       │
                    │  Interviews & Notifs    │
                    └─────────────────────────┘
```

---

## 📁 Complete Folder Structure

```text
Job Portal/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jobportal/
│   │   │   │   ├── JobPortalApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── WebConfig.java
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   │   └── UserPrincipal.java
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   └── enums/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── uploads/
│   │   └── test/
│   │       └── java/com/jobportal/JobPortalApplicationTests.java
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── navbar/
│   │   │   └── sidebar/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── auth/ (Login, Register, ForgotPassword)
│   │   │   ├── candidate/ (Dashboard, Profile, JobSearch, JobDetails, Applications, Interviews, Notifications)
│   │   │   ├── recruiter/ (Dashboard, ManageJobs, CreateJob, EditJob, Applications, Interviews, Profile)
│   │   │   ├── company/ (Dashboard, Profile, ManageRecruiters, CompanyJobs)
│   │   │   └── admin/ (Dashboard, ManageUsers, ManageCompanies, ManageJobs)
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   ├── candidateService.js
│   │   │   ├── recruiterService.js
│   │   │   ├── companyService.js
│   │   │   ├── applicationService.js
│   │   │   ├── interviewService.js
│   │   │   ├── notificationService.js
│   │   │   └── adminService.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── database/
│   └── schema.sql
├── README.md
└── .gitignore
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@careersync.com` | `Admin@123` | Platform Administrator |
| **Company Admin** | `techcorp.admin@careersync.com` | `Admin@123` | TechCorp Solutions Admin |
| **Company Admin** | `cloudscale.admin@careersync.com` | `Admin@123` | CloudScale Networks Admin |
| **Recruiter** | `sarah.recruiter@techcorp.com` | `Recruiter@123` | TechCorp Senior Recruiter |
| **Recruiter** | `david.recruiter@cloudscale.com` | `Recruiter@123` | CloudScale Lead Recruiter |
| **Candidate** | `alex.turner@gmail.com` | `Candidate@123` | Senior Full Stack Engineer |
| **Candidate** | `priya.sharma@gmail.com` | `Candidate@123` | Frontend Architect |
| **Candidate** | `john.doe@gmail.com` | `Candidate@123` | Cloud & DevOps Engineer |

*(You can also use the 1-click demo buttons on the Login page to instantly fill any of these accounts).*

---

## ⚙️ Setup & Running Locally

### Prerequisites
- **Java 17+** (JDK 17, 21, or 22)
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm**
- **PostgreSQL 14+**

---

### Step 1: Database Setup
Create a PostgreSQL database named `jobportal_db`:

```sql
CREATE DATABASE jobportal_db;
```

*(Optional: You can execute `database/schema.sql`, or let Hibernate automatically create tables with `spring.jpa.hibernate.ddl-auto=update` and auto-seed via `DataInitializer.java`).*

---

### Step 2: Run the Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

The REST API server will start on: **`http://localhost:8080`**

Environment variables (optional overrides):
- `DB_URL` (default: `jdbc:postgresql://localhost:5432/jobportal_db`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)
- `JWT_SECRET`
- `UPLOAD_DIR` (default: `uploads`)

---

### Step 3: Run the React Vite Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on: **`http://localhost:5173`**

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/register` — Register Candidate or Recruiter
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `POST /api/auth/reset-password` — Password reset endpoint
- `POST /api/auth/logout` — Invalidate user session

### Jobs & Applications
- `GET /api/jobs` — Public search jobs with keyword, location, salary, experience, and employment type filters
- `GET /api/jobs/{id}` — Get job specifications
- `POST /api/jobs` — Create job (Recruiter/Admin)
- `PUT /api/jobs/{id}` — Update job (Recruiter/Admin)
- `DELETE /api/jobs/{id}` — Delete job
- `POST /api/applications` — Submit job application (Candidate)
- `GET /api/applications/my` — Candidate application tracking
- `GET /api/applications/recruiter` — Recruiter applicant pool
- `PUT /api/applications/{id}/status` — Status workflow (APPLIED ➔ SHORTLISTED ➔ INTERVIEW_SCHEDULED ➔ SELECTED / REJECTED)

### Interviews & Resumes
- `POST /api/interviews` — Schedule technical interview
- `GET /api/interviews` — Retrieve user interview calendar
- `PUT /api/interviews/{id}` — Update interview status (SCHEDULED, COMPLETED, CANCELLED)
- `POST /api/candidates/resume` — Multipart file upload (PDF/DOC/DOCX)
- `GET /api/candidates/profile` — Candidate profile with skill tags and resumes

### Notifications & Admin
- `GET /api/notifications` — In-app notification center
- `PUT /api/notifications/{id}/read` — Mark notification read
- `GET /api/admin/stats` — Root system statistics
- `GET /api/admin/users` — User management and access control
- `PUT /api/admin/users/{id}/status` — Activate / deactivate accounts
