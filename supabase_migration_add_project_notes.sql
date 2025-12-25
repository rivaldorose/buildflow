-- Add project_notes table for project-specific notes
-- This table stores notes associated with projects (not pages)

CREATE TABLE IF NOT EXISTS project_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_notes_project ON project_notes(project);
CREATE INDEX IF NOT EXISTS idx_project_notes_created_date ON project_notes(created_date DESC);

-- Enable Row Level Security
ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_notes
CREATE POLICY "Users can view project notes of their projects"
  ON project_notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_notes.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create project notes for their projects"
  ON project_notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_notes.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update project notes of their projects"
  ON project_notes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_notes.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete project notes of their projects"
  ON project_notes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_notes.project AND projects.user_id = auth.uid()
  ));

-- Create trigger for updated_date
CREATE TRIGGER update_project_notes_updated_date BEFORE UPDATE ON project_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

