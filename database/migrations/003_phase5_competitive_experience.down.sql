-- ============================================================================
-- CodeSpark Phase 5 Rollback Migration: 003_phase5_competitive_experience.down.sql
-- Description: Cleanly drops all Phase 5 competitive coding tables.
-- ============================================================================

DROP TABLE IF EXISTS interview_sessions CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS contest_ratings CASCADE;
DROP TABLE IF EXISTS contest_rankings CASCADE;
DROP TABLE IF EXISTS contest_submissions CASCADE;
DROP TABLE IF EXISTS contest_registrations CASCADE;
DROP TABLE IF EXISTS contest_problems CASCADE;
DROP TABLE IF EXISTS contests CASCADE;
DROP TABLE IF EXISTS user_daily_challenges CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS user_problem_reviews CASCADE;
DROP TABLE IF EXISTS personal_problem_list_items CASCADE;
DROP TABLE IF EXISTS personal_problem_lists CASCADE;
DROP TABLE IF EXISTS user_study_plans CASCADE;
DROP TABLE IF EXISTS study_plan_problems CASCADE;
DROP TABLE IF EXISTS study_plan_sections CASCADE;
DROP TABLE IF EXISTS study_plans CASCADE;
