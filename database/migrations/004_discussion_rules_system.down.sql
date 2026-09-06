-- ============================================================================
-- CodeSpark Migration Rollback: 004_discussion_rules_system.down.sql
-- ============================================================================

DELETE FROM discussions WHERE id = 'discussion-rules' OR system_type = 'discussion_rules';

DROP INDEX IF EXISTS idx_discussions_system_type;
DROP INDEX IF EXISTS idx_discussions_is_system;

ALTER TABLE discussions 
DROP COLUMN IF EXISTS system_type,
DROP COLUMN IF EXISTS is_system_discussion;
