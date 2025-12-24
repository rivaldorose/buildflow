-- Migration: Add parent_page field to pages table for hierarchical pages
-- Run this in Supabase SQL Editor

-- Add parent_page column to pages table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pages' AND column_name = 'parent_page'
  ) THEN
    ALTER TABLE pages ADD COLUMN parent_page UUID REFERENCES pages(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create an index on parent_page for faster queries
CREATE INDEX IF NOT EXISTS idx_pages_parent_page ON pages(parent_page);

-- Create an index on (parent_page, project) for efficient filtering
CREATE INDEX IF NOT EXISTS idx_pages_parent_project ON pages(parent_page, project);

