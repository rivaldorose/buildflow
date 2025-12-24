-- Migration: Add category, priority, and due_date fields to project_todos table
-- Run this in Supabase SQL Editor

-- Add category column to project_todos table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_todos' AND column_name = 'category'
  ) THEN
    ALTER TABLE project_todos ADD COLUMN category TEXT;
  END IF;
END $$;

-- Add priority column to project_todos table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_todos' AND column_name = 'priority'
  ) THEN
    ALTER TABLE project_todos ADD COLUMN priority TEXT DEFAULT 'Medium';
  END IF;
END $$;

-- Add due_date column to project_todos table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_todos' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE project_todos ADD COLUMN due_date DATE;
  END IF;
END $$;

