-- Migration: Add path and status fields to pages table
-- Run this in Supabase SQL Editor if you haven't already

-- Add path column to pages table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pages' AND column_name = 'path'
  ) THEN
    ALTER TABLE pages ADD COLUMN path TEXT DEFAULT '/';
  END IF;
END $$;

-- Add status column to pages table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pages' AND column_name = 'status'
  ) THEN
    ALTER TABLE pages ADD COLUMN status TEXT DEFAULT 'Todo';
  END IF;
END $$;

-- Update existing pages to have default values if they're NULL
UPDATE pages SET path = '/' WHERE path IS NULL;
UPDATE pages SET status = 'Todo' WHERE status IS NULL;

-- Create index on path for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_pages_path ON pages(path);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

