-- Add project_idea table for project idea/notes
-- This table stores a single idea per project (simpler than notes - just one idea box)

CREATE TABLE IF NOT EXISTS project_idea (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project) -- Only one idea per project
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_idea_project ON project_idea(project);

-- Enable Row Level Security
ALTER TABLE project_idea ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_idea
CREATE POLICY "Users can view project ideas of their projects"
  ON project_idea FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_idea.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create project ideas for their projects"
  ON project_idea FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_idea.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update project ideas of their projects"
  ON project_idea FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_idea.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete project ideas of their projects"
  ON project_idea FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_idea.project AND projects.user_id = auth.uid()
  ));

-- Create trigger for updated_date
CREATE TRIGGER update_project_idea_updated_date BEFORE UPDATE ON project_idea
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

