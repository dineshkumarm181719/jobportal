-- ==============================================================================
-- Job Portal Complete PostgreSQL Database Schema
-- ==============================================================================

-- Create Enums / Domains if needed, or use CHECK constraints & VARCHARs for maximum JPA compatibility

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL CHECK (role IN ('CANDIDATE', 'RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    location VARCHAR(150),
    industry VARCHAR(100),
    logo VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_summary TEXT,
    location VARCHAR(150),
    experience VARCHAR(50),
    education VARCHAR(150),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Recruiters Table
CREATE TABLE IF NOT EXISTS recruiters (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    designation VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 7. Candidate Skills Join Table
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (candidate_id, skill_id)
);

-- 8. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id BIGINT NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(150) NOT NULL,
    employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE')),
    experience_required VARCHAR(50),
    salary_min NUMERIC(12, 2),
    salary_max NUMERIC(12, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED')),
    deadline DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Job Skills Join Table
CREATE TABLE IF NOT EXISTS job_skills (
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- 10. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id BIGINT REFERENCES resumes(id) ON DELETE SET NULL,
    cover_letter TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED', 'WITHDRAWN')),
    applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_candidate_job UNIQUE (candidate_id, job_id)
);

-- 11. Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    recruiter_id BIGINT NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
    interview_date DATE NOT NULL,
    interview_time VARCHAR(20) NOT NULL,
    interview_mode VARCHAR(20) NOT NULL CHECK (interview_mode IN ('ONLINE', 'OFFLINE')),
    meeting_link VARCHAR(500),
    location VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
