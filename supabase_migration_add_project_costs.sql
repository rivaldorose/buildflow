-- Migration: Add project costs fields
-- Run this in Supabase SQL Editor

-- Add cost columns to projects table
DO $$ 
BEGIN
  -- Total project cost
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'total_cost'
  ) THEN
    ALTER TABLE projects ADD COLUMN total_cost NUMERIC(10, 2) DEFAULT 0;
  END IF;

  -- Monthly recurring cost
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'monthly_cost'
  ) THEN
    ALTER TABLE projects ADD COLUMN monthly_cost NUMERIC(10, 2) DEFAULT 0;
  END IF;

  -- Currency (EUR, USD, etc.)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'currency'
  ) THEN
    ALTER TABLE projects ADD COLUMN currency TEXT DEFAULT 'EUR';
  END IF;

  -- Cost notes/description
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'cost_notes'
  ) THEN
    ALTER TABLE projects ADD COLUMN cost_notes TEXT;
  END IF;
END $$;

-- Create index for cost filtering
CREATE INDEX IF NOT EXISTS idx_projects_total_cost ON projects(total_cost);

