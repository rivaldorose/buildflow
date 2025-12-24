-- Migration: Create sprints table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Create sprints table
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  duration_weeks INTEGER,
  status TEXT DEFAULT 'planning', -- planning, active, completed, paused
  objectives JSONB, -- Array of objective objects
  team_members TEXT[], -- Array of team member IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

