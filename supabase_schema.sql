-- Supabase Database Schema for Buildflow App
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  app_type TEXT[] DEFAULT ARRAY['Web'],
  product_type TEXT DEFAULT 'SaaS',
  ai_builder TEXT,
  status TEXT DEFAULT 'Planning',
  progress INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Design Systems table
CREATE TABLE IF NOT EXISTS design_systems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  brand_colors JSONB,
  neutral_colors JSONB,
  semantic_colors JSONB,
  typography JSONB,
  spacing JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  purpose TEXT,
  description TEXT,
  frontend_code TEXT,
  flow UUID,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Features table
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  page UUID REFERENCES pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do',
  priority TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Flows table
CREATE TABLE IF NOT EXISTS flows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Todos table (for pages)
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page UUID REFERENCES pages(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Project Todos table
CREATE TABLE IF NOT EXISTS project_todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Test Cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page UUID REFERENCES pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  expected_result TEXT,
  actual_result TEXT,
  status TEXT DEFAULT 'Not Tested',
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page UUID REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'blue',
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- APIs table
CREATE TABLE IF NOT EXISTS apis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'External API',
  endpoint TEXT,
  method TEXT,
  headers JSONB,
  body JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Sprints table
CREATE TABLE IF NOT EXISTS sprints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Planning',
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Versions table
CREATE TABLE IF NOT EXISTS versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  version_number TEXT,
  data JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Logs table
CREATE TABLE IF NOT EXISTS credit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER,
  reason TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_date ON projects(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_pages_project ON pages(project);
CREATE INDEX IF NOT EXISTS idx_pages_created_date ON pages(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_features_project ON features(project);
CREATE INDEX IF NOT EXISTS idx_features_page ON features(page);
CREATE INDEX IF NOT EXISTS idx_flows_project ON flows(project);
CREATE INDEX IF NOT EXISTS idx_todos_page ON todos(page);
CREATE INDEX IF NOT EXISTS idx_project_todos_project ON project_todos(project);
CREATE INDEX IF NOT EXISTS idx_test_cases_page ON test_cases(page);
CREATE INDEX IF NOT EXISTS idx_notes_page ON notes(page);
CREATE INDEX IF NOT EXISTS idx_apis_project ON apis(project);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_project ON knowledge_base(project);
CREATE INDEX IF NOT EXISTS idx_sprints_project ON sprints(project);
CREATE INDEX IF NOT EXISTS idx_design_systems_project ON design_systems(project);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for design_systems (users can access if they own the project)
CREATE POLICY "Users can view design systems of their projects"
  ON design_systems FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = design_systems.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create design systems for their projects"
  ON design_systems FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = design_systems.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update design systems of their projects"
  ON design_systems FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = design_systems.project AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete design systems of their projects"
  ON design_systems FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = design_systems.project AND projects.user_id = auth.uid()
  ));

-- Similar RLS policies for other tables (simplified - same pattern)
-- Pages
CREATE POLICY "Users can manage pages of their projects"
  ON pages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = pages.project AND projects.user_id = auth.uid()
  ));

-- Features
CREATE POLICY "Users can manage features of their projects"
  ON features FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = features.project AND projects.user_id = auth.uid()
  ));

-- Flows
CREATE POLICY "Users can manage flows of their projects"
  ON flows FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = flows.project AND projects.user_id = auth.uid()
  ));

-- Todos
CREATE POLICY "Users can manage todos of their pages"
  ON todos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pages 
    JOIN projects ON projects.id = pages.project 
    WHERE pages.id = todos.page AND projects.user_id = auth.uid()
  ));

-- Project Todos
CREATE POLICY "Users can manage project todos of their projects"
  ON project_todos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_todos.project AND projects.user_id = auth.uid()
  ));

-- Test Cases
CREATE POLICY "Users can manage test cases of their pages"
  ON test_cases FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pages 
    JOIN projects ON projects.id = pages.project 
    WHERE pages.id = test_cases.page AND projects.user_id = auth.uid()
  ));

-- Notes
CREATE POLICY "Users can manage notes of their pages"
  ON notes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pages 
    JOIN projects ON projects.id = pages.project 
    WHERE pages.id = notes.page AND projects.user_id = auth.uid()
  ));

-- APIs
CREATE POLICY "Users can manage apis of their projects"
  ON apis FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = apis.project AND projects.user_id = auth.uid()
  ));

-- Knowledge Base
CREATE POLICY "Users can manage knowledge base of their projects"
  ON knowledge_base FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = knowledge_base.project AND projects.user_id = auth.uid()
  ));

-- Sprints
CREATE POLICY "Users can manage sprints of their projects"
  ON sprints FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = sprints.project AND projects.user_id = auth.uid()
  ));

-- Versions
CREATE POLICY "Users can view versions of their entities"
  ON versions FOR SELECT
  USING (true); -- Can be more specific based on entity_type

CREATE POLICY "Users can create versions"
  ON versions FOR INSERT
  WITH CHECK (true);

-- Credit Logs
CREATE POLICY "Users can view their own credit logs"
  ON credit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_date timestamp
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_date
CREATE TRIGGER update_projects_updated_date BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_design_systems_updated_date BEFORE UPDATE ON design_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_pages_updated_date BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_features_updated_date BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_flows_updated_date BEFORE UPDATE ON flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_todos_updated_date BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_project_todos_updated_date BEFORE UPDATE ON project_todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_test_cases_updated_date BEFORE UPDATE ON test_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_notes_updated_date BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_apis_updated_date BEFORE UPDATE ON apis
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_knowledge_base_updated_date BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_sprints_updated_date BEFORE UPDATE ON sprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

