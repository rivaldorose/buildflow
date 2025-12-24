-- Migration: Add missing columns to sprints table
-- Run this in Supabase SQL Editor

-- Add missing columns to sprints table if they don't exist
DO $$ 
BEGIN
  -- Add goal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sprints' AND column_name = 'goal'
  ) THEN
    ALTER TABLE sprints ADD COLUMN goal TEXT;
  END IF;

  -- Add duration_weeks column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sprints' AND column_name = 'duration_weeks'
  ) THEN
    ALTER TABLE sprints ADD COLUMN duration_weeks INTEGER;
  END IF;

  -- Add objectives column (JSONB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sprints' AND column_name = 'objectives'
  ) THEN
    ALTER TABLE sprints ADD COLUMN objectives JSONB;
  END IF;

  -- Add team_members column (TEXT array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sprints' AND column_name = 'team_members'
  ) THEN
    ALTER TABLE sprints ADD COLUMN team_members TEXT[];
  END IF;

  -- Update status default if needed (check current default)
  -- Note: This checks if status exists and updates default, but won't change existing values
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sprints' AND column_name = 'status' AND column_default IS NULL
  ) THEN
    ALTER TABLE sprints ALTER COLUMN status SET DEFAULT 'planning';
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view sprints for their projects" 
  ON public.sprints FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sprints for their projects" 
  ON public.sprints FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sprints for their projects" 
  ON public.sprints FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sprints for their projects" 
  ON public.sprints FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project 
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sprints_project ON public.sprints(project);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON public.sprints(status);
CREATE INDEX IF NOT EXISTS idx_sprints_start_date ON public.sprints(start_date);
CREATE INDEX IF NOT EXISTS idx_sprints_end_date ON public.sprints(end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_sprints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sprints_updated_at
  BEFORE UPDATE ON public.sprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sprints_updated_at();

