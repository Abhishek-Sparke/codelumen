-- ============================================================================
-- CodeSpark Phase 5 Migration: 003_phase5_competitive_experience.sql
-- Description: Schema for competitive coding features: Study Plans, Contests,
--              Rankings, Elo Ratings, Personal Lists, Daily Challenges,
--              Achievements, and Interview Practice.
-- Reversible: Yes (see 003_phase5_competitive_experience.down.sql)
-- ============================================================================

-- 1. STUDY PLANS TABLES
CREATE TABLE IF NOT EXISTS study_plans (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    estimated_duration VARCHAR(64) NOT NULL,
    total_problems INTEGER NOT NULL DEFAULT 0,
    badge_icon VARCHAR(64) NOT NULL DEFAULT 'BookOpen',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_plan_sections (
    id VARCHAR(64) PRIMARY KEY,
    study_plan_id VARCHAR(64) NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_plan_problems (
    id VARCHAR(64) PRIMARY KEY,
    section_id VARCHAR(64) NOT NULL REFERENCES study_plan_sections(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    position INTEGER NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (section_id, problem_id)
);

CREATE TABLE IF NOT EXISTS user_study_plans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    study_plan_id VARCHAR(64) NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, study_plan_id)
);

-- 2. PERSONAL PROBLEM LISTS TABLES
CREATE TABLE IF NOT EXISTS personal_problem_lists (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_problem_list_items (
    id VARCHAR(64) PRIMARY KEY,
    list_id VARCHAR(64) NOT NULL REFERENCES personal_problem_lists(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    position INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (list_id, problem_id)
);

-- 3. USER PROBLEM REVIEWS (REVISIT QUEUE)
CREATE TABLE IF NOT EXISTS user_problem_reviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    problem_id VARCHAR(64) NOT NULL,
    notes TEXT,
    reason VARCHAR(64) DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, problem_id)
);

-- 4. DAILY CHALLENGES TABLES
CREATE TABLE IF NOT EXISTS daily_challenges (
    id VARCHAR(64) PRIMARY KEY,
    challenge_date DATE UNIQUE NOT NULL,
    problem_id VARCHAR(64) NOT NULL,
    bonus_xp INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_daily_challenges (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'attempted' CHECK (status IN ('attempted', 'solved')),
    solved_at TIMESTAMPTZ,
    xp_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (challenge_id, user_id)
);

-- 5. CONTESTS TABLES
CREATE TABLE IF NOT EXISTS contests (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 90,
    status VARCHAR(32) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    is_rated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contest_problems (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 1,
    score_points INTEGER NOT NULL DEFAULT 100,
    UNIQUE (contest_id, problem_id),
    UNIQUE (contest_id, order_index)
);

CREATE TABLE IF NOT EXISTS contest_registrations (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (contest_id, user_id)
);

CREATE TABLE IF NOT EXISTS contest_submissions (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    submission_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    runtime_ms INTEGER NOT NULL DEFAULT 0,
    memory_mb NUMERIC(6,2) NOT NULL DEFAULT 0,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contest_rankings (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    solved_count INTEGER NOT NULL DEFAULT 0,
    penalty_minutes INTEGER NOT NULL DEFAULT 0,
    last_accepted_at TIMESTAMPTZ,
    rating_change INTEGER DEFAULT 0,
    new_rating INTEGER DEFAULT 1500,
    UNIQUE (contest_id, user_id)
);

CREATE TABLE IF NOT EXISTS contest_ratings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    previous_rating INTEGER NOT NULL DEFAULT 1500,
    rating_change INTEGER NOT NULL DEFAULT 0,
    new_rating INTEGER NOT NULL DEFAULT 1500,
    rank INTEGER NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, contest_id)
);

-- 6. ACHIEVEMENTS TABLES
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    icon_name VARCHAR(64) NOT NULL,
    badge_points INTEGER NOT NULL DEFAULT 100,
    criteria_type VARCHAR(64) NOT NULL,
    criteria_threshold INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    achievement_id VARCHAR(64) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

-- 7. INTERVIEW PRACTICE SESSIONS
CREATE TABLE IF NOT EXISTS interview_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    problem_ids TEXT[] NOT NULL DEFAULT '{}',
    solved_problem_ids TEXT[] NOT NULL DEFAULT '{}',
    score_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'completed'
);

-- INDEXES FOR SCALE & SPEED
CREATE INDEX IF NOT EXISTS idx_study_plan_sections_plan_id ON study_plan_sections(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_user_id ON user_study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_problem_lists_user_id ON personal_problem_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_contest_id ON contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_rankings_contest_rank ON contest_rankings(contest_id, rank);
CREATE INDEX IF NOT EXISTS idx_contest_ratings_user_id ON contest_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
