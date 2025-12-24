-- Temporary fix: Allow creating projects without authentication
-- IMPORTANT: This is only for testing! In production, you should require authentication.

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;

-- Create a new policy that allows inserts without requiring auth.uid() = user_id
-- This allows projects to be created even when user_id is NULL or doesn't match auth.uid()
CREATE POLICY "Allow project creation (temporary for testing)"
  ON projects FOR INSERT
  WITH CHECK (true);

-- Note: You can also create projects with user_id if you want to support both:
-- WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

