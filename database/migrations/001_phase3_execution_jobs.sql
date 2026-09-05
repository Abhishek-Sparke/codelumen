-- ============================================================================
-- CodeSpark Phase 3 Migration: 001_phase3_execution_jobs.sql
-- Description: Creates the execution_jobs table for asynchronous / queued job tracking.
-- Reversible: Yes (see 001_phase3_execution_jobs.down.sql)
-- ============================================================================

CREATE TABLE IF NOT EXISTS codespark_execution_jobs (
    id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(64) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    provider VARCHAR(64) NOT NULL DEFAULT 'codespark-sandbox',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_code VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on submission_id for fast joins
CREATE INDEX IF NOT EXISTS idx_execution_jobs_submission_id ON codespark_execution_jobs(submission_id);

-- Index on status for worker queue queries
CREATE INDEX IF NOT EXISTS idx_execution_jobs_status ON codespark_execution_jobs(status);
