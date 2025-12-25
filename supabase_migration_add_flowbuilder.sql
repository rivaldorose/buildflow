-- Add flowbuilder tables for flowchart/diagram builder
-- This extends the existing flows table with nodes and connections

-- Flow Nodes table
CREATE TABLE IF NOT EXISTS flow_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'rectangle', 'diamond', 'circle', 'database', 'note', etc.
  label TEXT,
  description TEXT,
  data JSONB, -- All node-specific data (fields, content, etc.)
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  width FLOAT,
  height FLOAT,
  style JSONB, -- Colors, borders, corner radius, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flow Connections table
CREATE TABLE IF NOT EXISTS flow_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  from_node_id UUID NOT NULL REFERENCES flow_nodes(id) ON DELETE CASCADE,
  from_port TEXT, -- 'top', 'right', 'bottom', 'left'
  to_node_id UUID NOT NULL REFERENCES flow_nodes(id) ON DELETE CASCADE,
  to_port TEXT,
  style TEXT DEFAULT 'straight', -- 'straight', 'curved', 'elbow', 'dashed'
  label TEXT,
  color TEXT DEFAULT '#6B46C1',
  stroke_width INTEGER DEFAULT 2,
  arrowhead BOOLEAN DEFAULT true,
  bidirectional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flow_nodes_flow_id ON flow_nodes(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_connections_flow_id ON flow_connections(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_connections_from_node ON flow_connections(from_node_id);
CREATE INDEX IF NOT EXISTS idx_flow_connections_to_node ON flow_connections(to_node_id);

-- Enable Row Level Security
ALTER TABLE flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flow_nodes
CREATE POLICY "Users can view flow nodes of their projects"
  ON flow_nodes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_nodes.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create flow nodes for their projects"
  ON flow_nodes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_nodes.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update flow nodes of their projects"
  ON flow_nodes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_nodes.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete flow nodes of their projects"
  ON flow_nodes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_nodes.flow_id AND projects.user_id = auth.uid()
  ));

-- RLS Policies for flow_connections
CREATE POLICY "Users can view flow connections of their projects"
  ON flow_connections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_connections.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create flow connections for their projects"
  ON flow_connections FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_connections.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update flow connections of their projects"
  ON flow_connections FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_connections.flow_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete flow connections of their projects"
  ON flow_connections FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM flows 
    JOIN projects ON projects.id = flows.project 
    WHERE flows.id = flow_connections.flow_id AND projects.user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_flow_nodes_updated_date BEFORE UPDATE ON flow_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

