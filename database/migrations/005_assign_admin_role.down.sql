-- ============================================================================
-- CodeSpark Migration: 005_assign_admin_role.down.sql
-- Description: Reverts administrator role for @sparke back to standard user.
-- ============================================================================

UPDATE users 
SET role = 'user', updated_at = NOW()
WHERE id IN (
    SELECT id FROM profiles WHERE username = 'sparke'
) OR email = 'sparke@example.com';
