-- ============================================================================
-- CodeSpark Phase 3 Down Migration: 001_phase3_execution_jobs.down.sql
-- Description: Reverses the execution_jobs table creation safely without touching user data.
-- ============================================================================

DROP INDEX IF EXISTS idx_execution_jobs_status;
DROP INDEX IF EXISTS idx_execution_jobs_submission_id;
DROP TABLE IF EXISTS codespark_execution_jobs CASCADE;
