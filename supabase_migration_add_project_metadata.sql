-- Migration: Add project metadata fields (backend, GitHub, hosting, etc.)
-- Run this in Supabase SQL Editor

-- Add metadata columns to projects table
DO $$ 
BEGIN
  -- Backend status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'backend_active'
  ) THEN
    ALTER TABLE projects ADD COLUMN backend_active BOOLEAN DEFAULT FALSE;
  END IF;

  -- GitHub repository
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'github_repo'
  ) THEN
    ALTER TABLE projects ADD COLUMN github_repo TEXT;
  END IF;

  -- Hosting URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'hosted_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN hosted_url TEXT;
  END IF;

  -- Hosting platform (Vercel, Netlify, etc.)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'hosting_platform'
  ) THEN
    ALTER TABLE projects ADD COLUMN hosting_platform TEXT;
  END IF;

  -- Database (Supabase, Firebase, etc.)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'database_platform'
  ) THEN
    ALTER TABLE projects ADD COLUMN database_platform TEXT;
  END IF;

  -- API deployed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'api_deployed'
  ) THEN
    ALTER TABLE projects ADD COLUMN api_deployed BOOLEAN DEFAULT FALSE;
  END IF;

  -- API URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'api_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN api_url TEXT;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_backend_active ON projects(backend_active);
CREATE INDEX IF NOT EXISTS idx_projects_hosting_platform ON projects(hosting_platform);

