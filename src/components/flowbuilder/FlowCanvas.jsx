import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import RectangleNode from './nodes/RectangleNode';
import DiamondNode from './nodes/DiamondNode';
import CircleNode from './nodes/CircleNode';
import DatabaseNode from './nodes/DatabaseNode';
import NoteNode from './nodes/NoteNode';

// Register custom node types
const nodeTypes = {
  rectangle: RectangleNode,
  diamond: DiamondNode,
  circle: CircleNode,
  database: DatabaseNode,
  note: NoteNode,
};

export default function FlowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  selectedNodeId,
  selectedEdgeId,
  zoom = 1,
  onZoomChange,
}) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // Sync external changes
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle node changes
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChangeInternal(changes);
      if (onNodesChange) {
        onNodesChange(changes);
      }
    },
    [onNodesChangeInternal, onNodesChange]
  );

  // Handle edge changes
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChange) {
        onEdgesChange(changes);
      }
    },
    [onEdgesChangeInternal, onEdgesChange]
  );

  // Handle new connections
  const handleConnect = useCallback(
    (params) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      if (onConnect) {
        onConnect(params);
      }
    },
    [edges, setEdges, onConnect]
  );

  // Default edge styles
  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6B46C1',
      },
      style: {
        strokeWidth: 2,
        stroke: '#6B46C1',
      },
    }),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={4}
        snapToGrid={true}
        snapGrid={[10, 10]}
        attributionPosition="bottom-left"
      >
        <Background
          variant="dots"
          gap={10}
          size={1}
          color="#E5E7EB"
          style={{ backgroundColor: '#F5F5F5' }}
        />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'circle':
                return '#E8F5E9';
              case 'diamond':
                return '#FFF4E6';
              case 'database':
                return '#E0F2FE';
              case 'note':
                return '#FFEB3B';
              default:
                return '#FFFFFF';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{ backgroundColor: '#FAFAFA' }}
        />
      </ReactFlow>
    </div>
  );
}

