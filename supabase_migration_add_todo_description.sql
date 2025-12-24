-- Migration: Add description field to project_todos table
-- Run this in Supabase SQL Editor

-- Add description column to project_todos table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_todos' AND column_name = 'description'
  ) THEN
    ALTER TABLE project_todos ADD COLUMN description TEXT;
  END IF;
END $$;

