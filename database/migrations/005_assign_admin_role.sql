-- ============================================================================
-- CodeSpark Migration: 005_assign_admin_role.sql
-- Description: Assigns administrator role to designated user via the relational
--              database user/role schema (users.role).
-- Reversible: Yes (see 005_assign_admin_role.down.sql)
-- ============================================================================

UPDATE users 
SET role = 'admin', updated_at = NOW()
WHERE id IN (
    SELECT id FROM profiles WHERE username = 'sparke'
) OR email = 'sparke@example.com';
