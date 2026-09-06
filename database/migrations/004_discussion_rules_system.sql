-- ============================================================================
-- CodeSpark Migration: 004_discussion_rules_system.sql
-- Description: Extends discussions table to support system discussions
--              such as Discussion Rules without creating duplicate tables.
-- Reversible: Yes (see 004_discussion_rules_system.down.sql)
-- ============================================================================

ALTER TABLE discussions 
ADD COLUMN IF NOT EXISTS is_system_discussion BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS system_type VARCHAR(64) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_discussions_is_system ON discussions(is_system_discussion);
CREATE INDEX IF NOT EXISTS idx_discussions_system_type ON discussions(system_type);

-- Seed Discussion Rules system record if not already present
INSERT INTO discussions (
    id,
    category_id,
    author_id,
    title,
    slug,
    content,
    is_pinned,
    is_locked,
    is_system_discussion,
    system_type,
    tags,
    created_at,
    updated_at
) 
SELECT 
    'discussion-rules',
    'cat-general',
    'system-codespark',
    'Discussion Rules',
    'discussion-rules',
    '',
    TRUE,
    TRUE,
    TRUE,
    'discussion_rules',
    ARRAY['Official', 'Rules'],
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM discussions WHERE id = 'discussion-rules' OR system_type = 'discussion_rules'
);
