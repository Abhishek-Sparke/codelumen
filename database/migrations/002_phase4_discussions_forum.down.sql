-- ============================================================================
-- CodeSpark Phase 4 Rollback: 002_phase4_discussions_forum.down.sql
-- Description: Reverses all changes introduced in 002_phase4_discussions_forum.sql.
-- ============================================================================

DROP TABLE IF EXISTS discussion_audit_logs CASCADE;
DROP TABLE IF EXISTS discussion_bookmarks CASCADE;
DROP TABLE IF EXISTS discussion_watchers CASCADE;
DROP TABLE IF EXISTS discussion_reactions CASCADE;
DROP TABLE IF EXISTS discussion_posts CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS discussion_categories CASCADE;
