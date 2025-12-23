-- Migration: Add company field to projects table
-- Run this in Supabase SQL Editor

-- Add company column to projects table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'company'
  ) THEN
    ALTER TABLE projects ADD COLUMN company TEXT;
  END IF;
END $$;

-- Create an index on company for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company);

