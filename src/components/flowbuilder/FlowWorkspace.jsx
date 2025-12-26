import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlowCanvas from './FlowCanvas';
import { Flow, FlowNode, FlowConnection } from '@/api/entities';
import { toast } from 'sonner';

export default function FlowWorkspace({ flowId, projectId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load flow data
  useEffect(() => {
    if (!flowId) return;
    loadFlowData();
  }, [flowId]);

  const loadFlowData = async () => {
    setIsLoading(true);
    try {
      // Load nodes
      const flowNodes = await FlowNode.list(flowId);
      const reactFlowNodes = flowNodes.map((node) => ({
        id: node.id,
        type: node.type || 'rectangle',
        position: { x: node.x || 0, y: node.y || 0 },
        data: {
          label: node.label || '',
          description: node.description || '',
          ...(node.data || {}),
          ...(node.style || {}),
        },
        style: {
          width: node.width,
          height: node.height,
        },
      }));

      // Load connections
      const flowConnections = await FlowConnection.list(flowId);
      const reactFlowEdges = flowConnections.map((conn) => ({
        id: conn.id,
        source: conn.from_node_id,
        target: conn.to_node_id,
        sourceHandle: conn.from_port,
        targetHandle: conn.to_port,
        label: conn.label || '',
        style: {
          stroke: conn.color || '#6B46C1',
          strokeWidth: conn.stroke_width || 2,
        },
        type: conn.style === 'curved' ? 'smoothstep' : 'default',
        markerEnd: {
          type: 'arrowclosed',
        },
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    } catch (error) {
      console.error('Error loading flow data:', error);
      toast.error('Failed to load flow');
    } finally {
      setIsLoading(false);
    }
  };

  // Save flow data
  const saveFlowData = useCallback(async () => {
    if (!flowId) return;
    setIsSaving(true);
    try {
      // Save nodes
      for (const node of nodes) {
        const nodeData = {
          flow_id: flowId,
          type: node.type,
          label: node.data?.label || '',
          description: node.data?.description || '',
          x: node.position.x,
          y: node.position.y,
          width: node.style?.width,
          height: node.style?.height,
          data: {
            ...node.data,
            label: undefined,
            description: undefined,
          },
          style: {
            color: node.data?.color,
            borderColor: node.data?.borderColor,
            cornerRadius: node.data?.cornerRadius,
          },
        };

        if (node.id.startsWith('temp-')) {
          // New node - create
          await FlowNode.create(nodeData);
        } else {
          // Existing node - update
          await FlowNode.update(node.id, nodeData);
        }
      }

      // Save edges
      for (const edge of edges) {
        const edgeData = {
          flow_id: flowId,
          from_node_id: edge.source,
          to_node_id: edge.target,
          from_port: edge.sourceHandle,
          to_port: edge.targetHandle,
          label: edge.label || '',
          style: edge.type === 'smoothstep' ? 'curved' : 'straight',
          color: edge.style?.stroke || '#6B46C1',
          stroke_width: edge.style?.strokeWidth || 2,
        };

        if (edge.id.startsWith('temp-')) {
          // New edge - create
          await FlowConnection.create(edgeData);
        } else {
          // Existing edge - update
          await FlowConnection.update(edge.id, edgeData);
        }
      }

      toast.success('Flow saved');
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error('Failed to save flow');
    } finally {
      setIsSaving(false);
    }
  }, [flowId, nodes, edges]);

  // Handle node changes
  const handleNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      // Apply changes to nodes
      const updatedNodes = [...nds];
      changes.forEach((change) => {
        if (change.type === 'position' && change.dragging === false) {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (node) {
            node.position = change.position;
          }
        } else if (change.type === 'dimensions') {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (node && node.style) {
            node.style.width = change.dimensions.width;
            node.style.height = change.dimensions.height;
          }
        }
      });
      return updatedNodes;
    });
  }, []);

  // Handle edge changes
  const handleEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      // Apply changes to edges
      return eds;
    });
  }, []);

  // Handle new connections
  const handleConnect = useCallback((params) => {
    const newEdge = {
      id: `temp-${Date.now()}`,
      ...params,
      style: {
        stroke: '#6B46C1',
        strokeWidth: 2,
      },
      markerEnd: {
        type: 'arrowclosed',
      },
    };
    setEdges((eds) => [...eds, newEdge]);
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  // Handle edge click
  const handleEdgeClick = useCallback((event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading flow...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <FlowCanvas
        initialNodes={nodes}
        initialEdges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        selectedNodeId={selectedNodeId}
        selectedEdgeId={selectedEdgeId}
      />
      
      {/* Save button */}
      <button
        onClick={saveFlowData}
        disabled={isSaving}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

