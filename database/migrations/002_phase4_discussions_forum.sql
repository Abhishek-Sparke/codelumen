-- ============================================================================
-- CodeSpark Phase 4 Migration: 002_phase4_discussions_forum.sql
-- Description: Full classic programming forum schema with categories, threads,
--              posts, reactions, watchers, bookmarks, and accepted answers.
-- Reversible: Yes (see 002_phase4_discussions_forum.down.sql)
-- ============================================================================

-- 1. DISCUSSION CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS discussion_categories (
    id VARCHAR(64) PRIMARY KEY,
    section_id VARCHAR(32) NOT NULL CHECK (section_id IN ('learn', 'programming', 'career', 'community')),
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(64) NOT NULL DEFAULT 'MessageSquare',
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussion_categories_section ON discussion_categories(section_id);
CREATE INDEX IF NOT EXISTS idx_discussion_categories_slug ON discussion_categories(slug);

-- 2. DISCUSSIONS TABLE
CREATE TABLE IF NOT EXISTS discussions (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL REFERENCES discussion_categories(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    problem_id VARCHAR(64),
    problem_title VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    is_solved BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_post_id VARCHAR(64),
    view_count INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussions_category_id ON discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_slug ON discussions(slug);
CREATE INDEX IF NOT EXISTS idx_discussions_last_activity ON discussions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_is_solved ON discussions(is_solved);
CREATE INDEX IF NOT EXISTS idx_discussions_is_pinned ON discussions(is_pinned);

-- 3. DISCUSSION POSTS TABLE (REPLIES)
CREATE TABLE IF NOT EXISTS discussion_posts (
    id VARCHAR(64) PRIMARY KEY,
    discussion_id VARCHAR(64) NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    post_number INTEGER NOT NULL,
    is_accepted_answer BOOLEAN NOT NULL DEFAULT FALSE,
    reply_to_post_number INTEGER,
    reply_to_author VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_discussion_post_number UNIQUE (discussion_id, post_number)
);

CREATE INDEX IF NOT EXISTS idx_discussion_posts_discussion ON discussion_posts(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_posts_author ON discussion_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_posts_number ON discussion_posts(discussion_id, post_number);

-- 4. DISCUSSION REACTIONS TABLE
CREATE TABLE IF NOT EXISTS discussion_reactions (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'helpful', 'great')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_post_reaction UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_discussion_reactions_post ON discussion_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_discussion_reactions_user ON discussion_reactions(user_id);

-- 5. DISCUSSION WATCHERS TABLE
CREATE TABLE IF NOT EXISTS discussion_watchers (
    user_id VARCHAR(64) NOT NULL,
    discussion_id VARCHAR(64) NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, discussion_id)
);

CREATE INDEX IF NOT EXISTS idx_discussion_watchers_user ON discussion_watchers(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_watchers_discussion ON discussion_watchers(discussion_id);

-- 6. DISCUSSION BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS discussion_bookmarks (
    user_id VARCHAR(64) NOT NULL,
    discussion_id VARCHAR(64) NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, discussion_id)
);

CREATE INDEX IF NOT EXISTS idx_discussion_bookmarks_user ON discussion_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_bookmarks_discussion ON discussion_bookmarks(discussion_id);

-- 7. DISCUSSION AUDIT LOGS (MODERATION ACTIONS)
CREATE TABLE IF NOT EXISTS discussion_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    discussion_id VARCHAR(64) REFERENCES discussions(id) ON DELETE SET NULL,
    actor_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
